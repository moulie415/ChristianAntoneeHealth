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

// const tests: {title: string; image: ImageSourcePropType}[] = [
//   {
//     title: 'Cardiovascular Recovery Test',
//     image: require('../../images/cardio.jpeg'),
//   },
//   {
//     title: 'The Cooper Aerobic Test',
//     image: require('../../images/aerobic.jpeg'),
//   },
//   {
//     title: 'The Plank Abdominal Endurance Test',
//     image: require('../../images/plank.jpeg'),
//   },
//   {
//     title: 'The Push Up Test',
//     image: require('../../images/push-up.jpeg'),
//   },
//   {
//     title: 'The Sit and Reach Flexibility Test',
//     image: require('../../images/sit-and-reach.jpeg'),
//   },
//   {
//     title: 'The Squatting Test',
//     image: require('../../images/squat.jpeg'),
//   },
// ];

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
  const items: {name: string; image: ImageSourcePropType}[] = tests
    ? Object.values(tests).map(({name}) => {
        return {name, image: getImage(name)};
      })
    : [];
  return (
    <Layout style={{flex: 1}}>
      {items.map(({name, image}, index) => {
        return (
          <TouchableOpacity key={name} style={{flex: 1}}>
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
                margin: 1,
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
    </Layout>
  );
};

const mapStateToProps = ({tests}: MyRootState) => ({
  tests: tests.tests,
});

export default connect(mapStateToProps)(FitnessTesting);
