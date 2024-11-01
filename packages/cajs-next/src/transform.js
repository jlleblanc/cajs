import { parseCAJS as parseCAJSCore } from 'cajs';

export function transformCAJSToNext(cajsConfig) {
  const parsed = parseCAJSCore(cajsConfig);

  let componentsCode = `import React from 'react';\n`;

  // Include imports for custom components
  const customComponents = new Set();

  for (const [name, component] of Object.entries(parsed.components)) {
    collectCustomComponents(component.element, customComponents);

    componentsCode += `
export function ${name}(props) {
  ${component.props && component.props.length > 0 ? `const { ${component.props.join(', ')} } = props;` : ''}
  return (
    ${generateElementCode(component.element)}
  );
}
    `;
  }

  // Add imports for custom components
  if (customComponents.size > 0) {
    componentsCode = `import { ${Array.from(customComponents).join(', ')} } from 'path-to-your-components';\n` + componentsCode;
  }

  return componentsCode;
}

function generateElementCode(element) {
  if (Array.isArray(element)) {
    const [tagString, maybeProps, maybeChildren] = element;

    // Parse the tag string
    const { tagName, className } = parseTag(tagString);

    let props = {};
    let children = null;

    // Determine if the second element is props or children
    if (isProps(maybeProps)) {
      props = maybeProps;
      children = maybeChildren;
    } else {
      children = maybeProps;
    }

    // Add className to props
    if (className) {
      props = { ...props, className: [className, props.className].filter(Boolean).join(' ') };
    }

    const propsCode = generatePropsCode(props);

    const childrenCode = Array.isArray(children)
      ? children.map(generateElementCode).join(', ')
      : typeof children === 'string'
      ? generateStringOrExpression(children)
      : children
      ? generateElementCode(children)
      : '';

    const childrenPart = childrenCode ? `, ${childrenCode}` : '';

    return `React.createElement(${getTagName(tagName)}, ${propsCode}${childrenPart})`;
  } else if (typeof element === 'string') {
    return generateStringOrExpression(element);
  }
  return 'null';
}

function isProps(obj) {
  return obj && typeof obj === 'object' && !Array.isArray(obj);
}

function generatePropsCode(props) {
  const propEntries = Object.entries(props).map(([key, value]) => {
    if (typeof value === 'string') {
      const expressionMatch = value.match(/^\{(.*)\}$/);
      if (expressionMatch) {
        // It's an expression
        return `${JSON.stringify(key)}: ${expressionMatch[1]}`;
      } else {
        return `${JSON.stringify(key)}: JSON.stringify(value)`;
      }
    } else if (typeof value === 'object') {
      return `${JSON.stringify(key)}: ${generatePropsCode(value)}`;
    } else {
      return `${JSON.stringify(key)}: ${JSON.stringify(value)}`;
    }
  });
  return `{ ${propEntries.join(', ')} }`;
}

function generateStringOrExpression(str) {
  const expressionMatch = str.match(/^\{(.*)\}$/);
  if (expressionMatch) {
    // It's an expression
    return expressionMatch[1];
  } else {
    return JSON.stringify(str);
  }
}

function getTagName(tagName) {
  // Check if tagName starts with an uppercase letter (custom component)
  if (/^[A-Z]/.test(tagName)) {
    customComponents.add(tagName);
    return tagName;
  }
  return JSON.stringify(tagName);
}

let customComponents = new Set();

function collectCustomComponents(element, set) {
  if (Array.isArray(element)) {
    const [tagString, maybeProps, maybeChildren] = element;
    const { tagName } = parseTag(tagString);

    if (/^[A-Z]/.test(tagName)) {
      set.add(tagName);
    }

    if (Array.isArray(maybeProps) || typeof maybeProps === 'string') {
      // Children without props
      collectCustomComponents(maybeProps, set);
    } else if (maybeChildren) {
      collectCustomComponents(maybeChildren, set);
    }
  } else if (Array.isArray(element)) {
    element.forEach((child) => collectCustomComponents(child, set));
  }
}

function parseTag(tagString) {
  const parts = tagString.split('.');
  const tagName = parts[0] || 'div';
  const className = parts.slice(1).join(' ');
  return { tagName, className };
}