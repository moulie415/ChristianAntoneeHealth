import React from 'react';
import styles from '../../styles/views/FitnessTesting';
import FitnessTestingProps from '../../types/views/FitnessTesting';
import {TouchableOpacity, View, ImageSourcePropType} from 'react-native';
import {MyRootState} from '../../types/Shared';
import {connect} from 'react-redux';
import colors from '../../constants/colors';
import {Layout, Text} from '@ui-kitten/components';
import globalStyles from '../../styles/globalStyles';
import ImageLoader from '../commons/ImageLoader';
import {SafeAreaView} from 'react-native-safe-area-context';
import DevicePixels from '../../helpers/DevicePixels';

const getImage = (name: string): ImageSourcePropType => {
  const lower = name.toLowerCase();
  if (lower.includes('cardio')) {
    return require('../../images/cardio.jpeg');
  }
  if (lower.includes('aerobic')) {
    return require('../../images/aerobic.jpeg');
  }
  if (lower.includes('plank')) {
    return require('../../images/plank.jpeg');
  }
  if (lower.includes('push up')) {
    return require('../../images/push-up.jpeg');
  }
  if (lower.includes('sit and reach')) {
    return require('../../images/sit-and-reach.jpeg');
  }
  return require('../../images/squat.jpeg');
};

const FitnessTesting: React.FC<FitnessTestingProps> = ({navigation, tests}) => {
  const items: {name: string; image: ImageSourcePropType; id: string}[] = tests
    ? Object.values(tests).map(({name, id}) => {
        return {name, image: getImage(name), id};
      })
    : [];
  return (
    <Layout style={{flex: 1}}>
      {/* <SafeAreaView style={{flex: 1}}> */}
      {items.map(({name, image, id}, index) => {
        return (
          <TouchableOpacity
            onPress={() => navigation.navigate('Test', {id})}
            key={name}
            style={{flex: 1}}>
            <ImageLoader
              style={{width: '100%', flex: 1}}
              delay={index * 200}
              resizeMode="cover"
              source={image}
            />
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                ...(index % 2 == 0 ? {right: 0} : {}),
                margin: DevicePixels[1],
              }}>
              <Text
                category="h6"
                style={[globalStyles.textShadow, {color: '#fff'}]}>
                {name}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
      {/* </SafeAreaView> */}
    </Layout>
  );
};

const mapStateToProps = ({tests}: MyRootState) => ({
  tests: tests.tests,
});

export default connect(mapStateToProps)(FitnessTesting);
