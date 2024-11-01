import { join } from 'path';

export function withCAJS(nextConfig = {}) {
  return {
    ...nextConfig,
    webpack: (config, { isServer, dev }) => {
      if (dev) {
        // Add CAJS file loader
        config.module.rules.push({
          test: /\.cajs\.js$/,
          use: [
            {
              loader: join(__dirname, 'cajs-loader.js')
            }
          ]
        });
      }

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, { isServer, dev });
      }
      return config;
    }
  };
}