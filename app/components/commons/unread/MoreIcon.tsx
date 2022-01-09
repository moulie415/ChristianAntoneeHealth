import React from 'react';
import {connect} from 'react-redux';
import {Text, Layout} from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {MyRootState} from '../../../types/Shared';
import colors from '../../../constants/colors';
import DevicePixels from '../../../helpers/DevicePixels';

const MoreIcon: React.FC<{
  unread: {[key: string]: number};
  size: number;
  color: string;
}> = ({unread, size, color}) => {
  const count = Object.values(unread || {}).reduce((acc, cur) => acc + cur, 0);
  return (
    <>
      <Icon name="ellipsis-h" size={size} color={color} />
      {count > 0 && (
        <Layout
          style={{
            width: DevicePixels[17],
            height: DevicePixels[17],
            borderRadius: DevicePixels[9],
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
            top: DevicePixels[3],
            right: DevicePixels[17],
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
        </Layout>
      )}
    </>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  unread: profile.profile.unread,
});

export default connect(mapStateToProps)(MoreIcon);
