import {TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import DevicePixels from '../../helpers/DevicePixels';
import colors from '../../constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import globalStyles from '../../styles/globalStyles';
import Animated, {SlideOutUp, SlideInUp} from 'react-native-reanimated';
import {
  ApiConfig,
  ApiScope,
  auth as SpotifyAuth,
  remote as SpotifyRemote,
} from 'react-native-spotify-remote';
import Config from 'react-native-config';

const spotifyConfig: ApiConfig = {
  clientID: Config.SPOTIFY_CLIENT_ID,
  redirectURL: Config.SPOTIFY_REDIRECT_URL,
  tokenRefreshURL: Config.SPOTIFY_TOKEN_REFRESH_URL,
  tokenSwapURL: Config.SPOTIFY_TOKEN_SWAP_URL,
  scopes: [ApiScope.AppRemoteControlScope, ApiScope.UserFollowReadScope],
};

const MusicButton: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <>
      <TouchableOpacity
        onPress={() => setShowMenu(true)}
        style={{
          position: 'absolute',
          top: DevicePixels[20],
          right: DevicePixels[20],
          height: DevicePixels[50],
          width: DevicePixels[50],
          borderRadius: DevicePixels[25],
          backgroundColor: colors.appBlue,
          alignItems: 'center',
          justifyContent: 'center',
          ...globalStyles.boxShadow,
        }}>
        <Icon name="music" color={colors.appWhite} size={DevicePixels[20]} />
      </TouchableOpacity>
      {showMenu && (
        <Animated.View
          entering={SlideInUp}
          exiting={SlideOutUp}
          style={{
            backgroundColor: colors.appWhite,
            top: 0,
            right: 0,
            left: 0,
            position: 'absolute',
            height: DevicePixels[150],
            ...globalStyles.boxShadow,
          }}>
          <TouchableOpacity
            onPress={() => setShowMenu(false)}
            style={{
              position: 'absolute',
              bottom: - DevicePixels[20],
              right: DevicePixels[20],
              height: DevicePixels[40],
              width: DevicePixels[40],
              borderRadius: DevicePixels[20],
              backgroundColor: colors.appBlue,
              alignItems: 'center',
              justifyContent: 'center',
              ...globalStyles.boxShadow,
            }}>
            <Icon
              name="chevron-up"
              color={colors.appWhite}
              size={DevicePixels[25]}
            />
          </TouchableOpacity>
        </Animated.View>
      )}
    </>
  );
};

export default MusicButton;
