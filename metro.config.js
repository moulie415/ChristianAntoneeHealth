const { getDefaultConfig } = require('expo/metro-config');
const { mergeConfig } = require('@react-native/metro-config');

const {withSentryConfig} = require('@sentry/react-native/metro');

const path = require('node:path');

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

const ALIASES = {
  tslib: path.resolve(__dirname, "node_modules/tslib/tslib.es6.js"),
};

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */

module.exports = withSentryConfig(
  mergeConfig(defaultConfig, {
    resetCache: true,
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer/react-native'),
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
      resolveRequest: (context, moduleName, platform) => {
        return context.resolveRequest(
          context,
          ALIASES[moduleName] ?? moduleName,
          platform
        )
      }
    },
  }),
);


