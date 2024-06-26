import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '../../App';
import {SavedTest} from '../../types/SavedItem';
import Test from '../../types/Test';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {StackParamList} from '../../App';
import colors from '../../constants/colors';
import {Profile} from '../../types/Shared';
import FastImageAnimated from './FastImageAnimated';
import Text from './Text';

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
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Test', {id: test.id})}
      key={test.name}>
      <FastImageAnimated
        style={{
          height: 120,
          marginHorizontal: 15,
          marginBottom: 10,
          borderRadius: 10,
        }}
        source={{uri: test.thumbnail.src}}>
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
              bottom: 20,
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
      </FastImageAnimated>
    </TouchableOpacity>
  );
};

const mapStateToProps = ({tests, profile}: RootState) => ({
  tests: tests.tests,
  profile: profile.profile,
});

export default connect(mapStateToProps)(SavedTestCard);
