const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const {withSentryConfig} = require('@sentry/react-native/metro');

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

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
    },
  }),
);


