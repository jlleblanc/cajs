import React from 'react';

export function createComponents(cajsConfig) {
  const { components, pages } = cajsConfig;

  // Create Next.js pages
  const pageComponents = {};
  for (const [route, page] of Object.entries(pages)) {
    pageComponents[route] = React.memo(function Page(props) {
      return React.createElement(components[page.component], props);
    });
  }

  return {
    pages: pageComponents,
    components
  };
}