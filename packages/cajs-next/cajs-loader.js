import { transformCAJSToNext } from './transform';

export default async function loader() {
  const callback = this.async();

  try {
    const configPath = this.resourcePath;

    // Dynamically import the CAJS config module as ES module
    const cajsConfigModule = await import(configPath);
    const cajsConfig = cajsConfigModule.default || cajsConfigModule;

    const transformedCode = transformCAJSToNext(cajsConfig);

    callback(null, transformedCode);
  } catch (err) {
    callback(err);
  }
}