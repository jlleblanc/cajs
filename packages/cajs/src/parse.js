// Import necessary libraries
import React from 'react';

// Utility function to parse the tag string
function parseTag(tagString) {
  const parts = tagString.split('.');
  const tagName = parts[0] || 'div';
  const className = parts.slice(1).join(' ');
  return { tagName, className };
}

// Utility function to render element definitions
function renderElement(element, contextProps, config) {
  // If element is already a valid React element, return it directly
  if (React.isValidElement(element)) {
    return element;
  }

  // If element is an array, map over and render each child
  if (Array.isArray(element)) {
    return element.map((child, index) =>
      renderElement(child, contextProps, config)
    );
  }

  // Handle object case
  if (typeof element === 'object' && element !== null) {
    const { type, props = {}, children } = element;

    // Render children if present
    const renderedChildren = children
      ? (Array.isArray(children)
          ? children.map((child, index) => renderElement(child, contextProps, config))
          : renderElement(children, contextProps, config))
      : null;

    return React.createElement(
      type,
      { ...contextProps, ...props, key: props.key || undefined },
      renderedChildren
    );
  }

  // Return primitive values as-is
  return element;
}

// Modify parsePages to accept config parameter
function parsePages(pagesDef, config) {
  const pages = {};

  // Return empty object if no pages defined
  if (!pagesDef) {
    return pages;
  }

  // Validate pagesDef is an object
  if (typeof pagesDef !== 'object' || Array.isArray(pagesDef)) {
    throw new Error('Pages definition must be an object');
  }

  try {
    for (const [route, definition] of Object.entries(pagesDef)) {
      if (!definition) {
        console.warn(`Skipping invalid page definition for route: ${route}`);
        continue;
      }

      if (typeof definition === 'object' && definition.type === 'markdown') {
        // Handle markdown pages
        if (!definition.content || !config.markdown?.[definition.content]) {
          console.warn(`Missing markdown content for route: ${route}`);
          continue;
        }

        pages[route] = {
          type: 'markdown',
          content: definition.content,
          element: ['div.markdown-content', {
            dangerouslySetInnerHTML: {
              __html: config.markdown[definition.content]
            }
          }]
        };
      } else if (Array.isArray(definition)) {
        // Handle regular pages
        const [componentName, title, description] = definition;
        if (!componentName) {
          console.warn(`Missing component name for route: ${route}`);
          continue;
        }

        pages[route] = {
          type: 'component',
          component: componentName,
          title: title || '',
          description: description || '',
          element: [componentName]
        };
      } else {
        console.warn(`Invalid page definition format for route: ${route}`);
      }
    }
  } catch (error) {
    console.error('Error parsing pages:', error);
    return {};
  }

  return pages;
}

// Function to get the component by name
function getComponentByName(name) {
  // Check if it's a custom component
  if (components[name]) {
    return components[name];
  }

  return name;
}

// Function to resolve dynamic expressions in props
function resolveDynamicProps(elementProps, contextProps) {
  const resolvedProps = {};
  for (const key in elementProps) {
    let value = elementProps[key];
    if (typeof value === 'string') {
      value = resolveDynamicString(value, contextProps);
    } else if (typeof value === 'object' && value !== null) {
      value = resolveDynamicProps(value, contextProps);
    }
    resolvedProps[key] = value;
  }
  return resolvedProps;
}

// Function to resolve dynamic expressions in strings
function resolveDynamicString(template, contextProps) {
  return template.replace(/\{(.*?)\}/g, (_, expr) => {
    try {
      const func = new Function(...Object.keys(contextProps), `return ${expr}`);
      return func(...Object.values(contextProps));
    } catch (e) {
      console.error('Error resolving dynamic string:', e);
      return '';
    }
  });
}

const components = {};

function createComponents(config) {
  if (!config || !config.components) {
    return components;
  }

  for (const componentName in config.components) {
    const componentDef = config.components[componentName];
    const { props: componentProps = [], element } = componentDef;

    const Component = (props) => {
      // Merge component props into context props for dynamic expression resolution
      const contextProps = { ...props };

      // Include default props as null if not provided
      componentProps.forEach((propName) => {
        if (!(propName in contextProps)) {
          contextProps[propName] = null;
        }
      });

      return renderElement(element, contextProps, config);
    };

    Component.displayName = componentName;
    components[componentName] = Component;
  }

  return components;
}

// Update parseCAJS to use createComponents
function parseCAJS(config) {
  const components = createComponents(config);
  const pages = config.pages ? parsePages(config.pages, config) : {};

  return {
    meta: config.meta || {},
    components,
    pages,
  };
}

export {
  parseTag,
  renderElement,
  parsePages,
  parseCAJS,
  createComponents
};