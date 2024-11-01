// Import necessary libraries
import React from 'react';

// Utility function to parse the tag string
function parseTag(tagString) {
  const parts = tagString.split('.');
  const tagName = parts[0] || 'div';
  const className = parts.slice(1).join(' ');
  return { tagName, className };
}

function isProps(obj) {
  return obj && typeof obj === 'object' && !Array.isArray(obj);
}

// Utility function to render element definitions
function renderElement(element, contextProps, config, components) {
  if (Array.isArray(element)) {
    const [tagString, maybeProps, maybeChildren] = element;

    // Parse the tag string
    const { tagName, className } = parseTag(tagString);

    let props = {};
    let children = null;

    if (isProps(maybeProps)) {
      props = maybeProps;
      children = maybeChildren;
    } else {
      children = maybeProps;
    }

    // Add className to props
    if (className) {
      props = { ...props, className: [props.className, className].filter(Boolean).join(' ') };
    }

    // Resolve dynamic props
    const resolvedProps = resolveDynamicProps(props, contextProps);

    // Resolve children
    const renderedChildren = Array.isArray(children)
      ? children.map((child) => renderElement(child, contextProps, config, components)) // Pass components here
      : typeof children === 'string'
      ? resolveDynamicString(children, contextProps)
      : children
      ? renderElement(children, contextProps, config, components) // Pass components here
      : null;

    // Handle custom components
    let Component;
    if (/^[A-Z]/.test(tagName)) {
      // Custom component
      Component = components[tagName];
      if (!Component) {
        throw new Error(`Component ${tagName} not found`);
      }
    } else {
      // HTML tag
      Component = tagName;
    }

    return React.createElement(
      Component,
      resolvedProps,
      renderedChildren
    );
  } else if (typeof element === 'string') {
    return resolveDynamicString(element, contextProps);
  }
  return null;
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

// Function to resolve dynamic expressions in props
function resolveDynamicProps(props, contextProps) {
  const resolvedProps = {};
  for (const key in props) {
    let value = props[key];
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
  return template.replace(/\{([^}]+)\}/g, (match, expr) => {
    try {
      // Use a safe evaluation mechanism
      const func = new Function(...Object.keys(contextProps), `return ${expr};`);
      return func(...Object.values(contextProps));
    } catch (e) {
      console.error('Error evaluating expression:', expr, e);
      return '';
    }
  });
}

function createComponents(config) {
  const components = {};

  if (!config || !config.components) {
    return components;
  }

  for (const componentName in config.components) {
    const componentDef = config.components[componentName];
    const { props: componentProps = [], element } = componentDef;

    const Component = (props) => {
      const contextProps = { ...props };

      // Include default props as null if not provided
      componentProps.forEach((propName) => {
        if (!(propName in contextProps)) {
          contextProps[propName] = null;
        }
      });

      // Pass `components` to `renderElement`
      return renderElement(element, contextProps, config, components);
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