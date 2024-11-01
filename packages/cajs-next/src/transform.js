import { parseCAJS as parseCAJSCore } from 'cajs';

export function transformCAJSToNext(cajsConfig) {
  const parsed = parseCAJSCore(cajsConfig);

  // Transform CAJS components into Next.js components
  const components = {};
  for (const [name, component] of Object.entries(parsed.components)) {
    components[name] = {
      ...component,
      // Add Next.js specific properties
      getLayout: component.layout || ((page) => page)
    };
  }

  return {
    ...parsed,
    components
  };
}