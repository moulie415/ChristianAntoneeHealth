import React from 'react';
import {connect} from 'react-redux';
import {MyRootState} from '../../../types/Shared';
import colors from '../../../constants/colors';
import DevicePixels from '../../../helpers/DevicePixels';
import {View} from 'react-native';
import Text from '../Text';

const UnreadRowCount: React.FC<{unread: {[key: string]: number}}> = ({
  unread,
}) => {
  const count = Object.values(unread || {}).reduce((acc, cur) => acc + cur, 0);
  if (count > 0) {
    return (
      <View
        style={{
          marginLeft: DevicePixels[5],
          width: DevicePixels[18],
          height: DevicePixels[18],
          borderRadius: DevicePixels[9],
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.appRed,
        }}>
        <Text
          style={{
            fontSize: DevicePixels[10],
            fontWeight: 'bold',
            color: '#fff',
          }}>
          {count > 9 ? '9+' : count}
        </Text>
      </View>
    );
  }
  return null;
};

const mapStateToProps = ({profile}: MyRootState) => ({
  unread: profile.profile.unread,
});

export default connect(mapStateToProps)(UnreadRowCount);
