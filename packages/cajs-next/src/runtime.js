import React from 'react';
import { parseCAJS } from 'cajs';

export function createDynamicPage(cajsConfig, path) {
  const parsed = parseCAJS(cajsConfig);
  const pageData = parsed.pages[path];

  if (!pageData) {
    return () => React.createElement('div', null, '404 - Page not found');
  }

  const componentName = Array.isArray(pageData) ? pageData[0] : pageData.component;
  const Component = parsed.components[componentName];

  return function Page(props) {
    return React.createElement(Component, props);
  };
}
