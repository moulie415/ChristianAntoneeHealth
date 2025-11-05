import { ConfigContext } from '@expo/config';
import 'dotenv/config';

module.exports = ({ config }: ConfigContext) => ({
  ...config,
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
