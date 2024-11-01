import { parseCAJS } from './transform';

export default function loader(source) {
  const callback = this.async();
  try {
    const parsedConfig = parseCAJS(source);
    const result = `
      import { createComponents } from 'cajs-next/runtime';
      export default createComponents(${JSON.stringify(parsedConfig)});
    `;
    callback(null, result);
  } catch (err) {
    callback(err);
  }
}