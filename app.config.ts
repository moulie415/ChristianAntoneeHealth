import { ConfigContext } from '@expo/config';
import 'dotenv/config';

module.exports = ({ config }: ConfigContext) => ({
  ...config,
  version: process.env.VERSION || '1.0.0',
  ios: {
    ...config.ios,
    buildNumber: process.env.RUN_NUMBER || 1,
  },
  android: {
    ...config.android,
    versionCode: process.env.RUN_NUMBER || 1,
  },
  plugins: [
    ...(config.plugins
      ? [
          ...config.plugins,
          [
            'react-native-fbsdk-next',
            {
              appID: process.env.FACEBOOK_APP_ID,
              clientToken: process.env.FACEBOOK_CLIENT_TOKEN,
              displayName: config.name,
              scheme: `fb${process.env.FACEBOOK_APP_ID}`,
            },
          ],
        ]
      : []),
  ],
});
