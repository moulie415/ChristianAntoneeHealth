import moment from 'moment';
import React from 'react';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import colors from '../../constants/colors';
import Education from '../../types/Education';
import FastImageAnimated from './FastImageAnimated';
import Text from './Text';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {MyRootState} from '../../types/Shared';
import {connect} from 'react-redux';
import Profile from '../../types/Profile';

const {height, width} = Dimensions.get('window');

const EducationCard: React.FC<{
  item: Education;
  onPress: (item?: Education) => void;
  profile: Profile;
}> = ({item, onPress, profile}) => {
  return (
    <TouchableOpacity
      style={{
        height: 125,
        marginHorizontal: 15,
        marginBottom: 15,
        borderRadius: 10,
        overflow: 'hidden',
      }}
      onPress={() => onPress(item)}>
      <FastImageAnimated
        style={{
          position: 'absolute',
          height: 125,
          width: '100%',
        }}
        source={{uri: item.image.src}}
      />

      <View
        style={{
          position: 'absolute',
          alignSelf: 'flex-end',
          right: 0,
          top: 0,
          bottom: 0,
          width: width / 1.5,
          padding: 10,
          backgroundColor: 'rgba(0,0,0,0.7)',
        }}>
        <Text
          style={{
            color: colors.appWhite,
            fontSize: 10,
          }}>
          {moment(item.createdate).format('DD MMMM YYYY')}
        </Text>
        <Text
          style={{
            color: colors.appWhite,
            fontSize: 16,
            fontWeight: 'bold',
          }}>
          {item.title}
        </Text>

        {item.premium && !profile.premium && (
          <View
            style={{
              position: 'absolute',
              bottom: 15,
              right: 15,
            }}>
            <Icon name="lock" size={20} color={colors.appWhite} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(EducationCard);
