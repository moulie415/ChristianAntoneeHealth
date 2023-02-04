import {View, TouchableOpacity} from 'react-native';
import React from 'react';
import {SavedTest} from '../../types/SavedItem';
import {connect} from 'react-redux';
import {MyRootState} from '../../types/Shared';
import Test from '../../types/Test';

import FastImage from 'react-native-fast-image';
import {getTestImage} from '../../helpers/images';
import Profile from '../../types/Profile';
import colors from '../../constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';
import Text from './Text';
import moment from 'moment';

const SavedTestCard: React.FC<{
  item: SavedTest;
  tests: {[key: string]: Test};
  profile: Profile;
  navigation: NativeStackNavigationProp<StackParamList, 'SavedItems'>;
}> = ({item, tests, profile, navigation}) => {
  const test = tests[item.testId];
  if (!test) {
    return null;
  }
  const image = getTestImage(
    Object.values(tests).findIndex(i => i.id === test.id),
  );
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Test', {id: test.id})}
      key={test.name}>
      <FastImage
        style={{
          height: 140,
          marginHorizontal: 15,
          marginBottom: 10,
          borderRadius: 10,
        }}
        source={image}>
        <View
          style={{
            height: 140,
            justifyContent: 'center',
            padding: 10,
            borderRadius: 10,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          {test.premium && !profile.premium && (
            <View
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                margin: 10,
              }}>
              <Icon name="lock" color="#fff" size={30} />
            </View>
          )}

          <View
            style={{
              position: 'absolute',
              top: 0,
              width: 200,
              margin: 20,
            }}>
            <Text
              style={{
                color: colors.appWhite,
                fontSize: 16,
              }}>
              {`${moment(item.createdate).format('MMMM Do YYYY')}`}
            </Text>
            <Text style={{color: '#fff'}}>
              {test.type === 'countup'
                ? `Seconds: ${moment()
                    .utc()
                    .startOf('day')
                    .add({seconds: item.seconds})
                    .format('mm:ss')}`
                : `Score ${item.result}`}
            </Text>
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              width: 200,
              margin: 20,
            }}>
            <Text
              style={{
                color: colors.appWhite,
                fontSize: 16,
                fontWeight: 'bold',
              }}>
              {test.name}
            </Text>
          </View>
        </View>
      </FastImage>
    </TouchableOpacity>
  );
};

const mapStateToProps = ({tests, profile}: MyRootState) => ({
  tests: tests.tests,
  profile: profile.profile,
});

export default connect(mapStateToProps)(SavedTestCard);
