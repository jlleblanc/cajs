// Import necessary libraries
import React from 'react';

// Import pre-built components (e.g., from ShadCN UI)
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   Button,
//   Input,
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   AlertDialog,
//   Toast,
// } from 'shadcn';

// Load the app configuration
import appConfig from '../examples/pet-food-cajs.js';

// Utility function to parse the tag string
function parseTag(tagString) {
  const parts = tagString.split('.');
  const tagName = parts[0] || 'div';
  const className = parts.slice(1).join(' ');
  return { tagName, className };
}

// Utility function to render element definitions
function renderElement(elementDef, props = {}) {
  if (typeof elementDef === 'string') {
    return resolveDynamicString(elementDef, props);
  }

  if (Array.isArray(elementDef)) {
    let [name, elementProps = {}, children = null] = elementDef;

    // Adjust arguments if elementProps is actually children
    if (Array.isArray(elementProps) || typeof elementProps === 'string') {
      children = elementProps;
      elementProps = {};
    }

    const { tagName, className } = parseTag(name);

    // Merge className from tag parsing and elementProps
    if (className) {
      elementProps.className = [elementProps.className, className].filter(Boolean).join(' ');
    }

    // Resolve dynamic expressions in props
    elementProps = resolveDynamicProps(elementProps, props);

    // Get the component to render
    const Component = getComponentByName(tagName);

    // Render children recursively
    let childrenElements = null;
    if (Array.isArray(children)) {
      childrenElements = children.map((child, index) => (
        React.isValidElement(child)
          ? React.cloneElement(child, { key: index })
          : renderElement(child, props)
      ));
    } else if (typeof children === 'string') {
      childrenElements = resolveDynamicString(children, props);
    }

    return React.createElement(Component, elementProps, childrenElements);
  }

  return null;
}

// Function to get the component by name
function getComponentByName(name) {
  // Check if it's a custom component
  if (components[name]) {
    return components[name];
  }
  // Check if it's a pre-built component
  // const prebuiltComponents = {
  //   Card,
  //   CardHeader,
  //   CardTitle,
  //   CardContent,
  //   Button,
  //   Input,
  //   Dialog,
  //   DialogTrigger,
  //   DialogContent,
  //   AlertDialog,
  //   Toast,
  //   // Add other pre-built components here
  // };
  // if (prebuiltComponents[name]) {
  //   return prebuiltComponents[name];
  // }
  // Fallback to native HTML elements
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

// Generated components will be stored here
const components = {};

// Build components from the configuration
for (const componentName in appConfig.components) {
  const componentDef = appConfig.components[componentName];
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

    return renderElement(element, contextProps);
  };

  Component.displayName = componentName;

  components[componentName] = Component;
}

// Export components
export default components;