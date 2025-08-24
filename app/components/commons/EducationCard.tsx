import {FontAwesome6} from '@react-native-vector-icons/fontawesome6';
import moment from 'moment';
import React from 'react';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import {RootState} from '../../App';
import colors from '../../constants/colors';
import Education from '../../types/Education';
import {Profile} from '../../types/Shared';
import FastImageAnimated from './FastImageAnimated';
import Text from './Text';

const {height, width} = Dimensions.get('window');

const EducationCard: React.FC<{
  item: Education;
  onPress: (item?: Education) => void;
  profile: Profile;
  plan?: boolean;
}> = ({item, onPress, profile, plan}) => {
  return (
    <TouchableOpacity
      style={{
        height: plan ? undefined : 125,
        marginHorizontal: 15,
        marginBottom: 15,
        borderRadius: 10,
        overflow: 'hidden',
      }}
      onPress={() => onPress(item)}>
      <FastImageAnimated
        style={{
          height: 125,
          width: '100%',
        }}
        source={{uri: item.image.src}}
      />
      {plan ? (
        <LinearGradient
          colors={[
            'rgba(54, 57, 68,0)',
            'rgba(54, 57, 68,0.8)',
            'rgb(54, 57, 68)',
          ]}
          style={{
            height: 100,
            justifyContent: 'flex-end',
            padding: 10,
            borderRadius: 10,
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,
            marginBottom: -1,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <FontAwesome6
              iconStyle="solid"
              name="book-open"
              color={colors.appWhite}
              size={30}
              style={{marginHorizontal: 10}}
            />
            <View style={{flex: 1}}>
              <Text
                style={{
                  color: colors.appWhite,
                  fontSize: 25,
                  fontWeight: 'bold',
                }}>
                Education
              </Text>
              <Text
                style={{
                  color: colors.appWhite,
                  fontSize: 16,
                  marginTop: 5,
                  fontWeight: 'bold',
                }}>
                {item.title}
              </Text>
            </View>
          </View>
        </LinearGradient>
      ) : (
        <LinearGradient
          colors={[
            'rgba(54, 57, 68,0)',
            'rgba(54, 57, 68,0.8)',
            'rgb(54, 57, 68)',
          ]}
          style={{
            position: 'absolute',
            alignSelf: 'flex-end',
            justifyContent: 'flex-end',
            right: 0,
            bottom: 0,
            left: 0,
            padding: 10,
            height: 100,
            marginBottom: -1,
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
        </LinearGradient>
      )}

      {item.premium && !profile.premium && !plan && (
        <View
          style={{
            position: 'absolute',
            top: 15,
            right: 15,
          }}>
          <FontAwesome6
            iconStyle="solid"
            name="lock"
            size={20}
            color={colors.appWhite}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const mapStateToProps = ({profile}: RootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(EducationCard);
