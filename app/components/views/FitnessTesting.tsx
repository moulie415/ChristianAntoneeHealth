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

const tests: {title: string; image: ImageSourcePropType; delay?: number}[] = [
  {
    title: 'Cardiovascular Recovery Test',
    image: require('../../images/cardio.jpeg'),
  },
  {
    title: 'The Cooper Aerobic Test',
    image: require('../../images/aerobic.jpeg'),
    delay: 200,
  },
  {
    title: 'The Plank Abdominal Endurance Test',
    image: require('../../images/plank.jpeg'),
    delay: 400,
  },
  {
    title: 'The Push Up Test',
    image: require('../../images/push-up.jpeg'),
    delay: 600,
  },
  {
    title: 'The Sit and Reach Flexibility Test',
    image: require('../../images/sit-and-reach.jpeg'),
    delay: 800,
  },
  {
    title: 'The Squatting Test',
    image: require('../../images/squat.jpeg'),
    delay: 1000,
  },
];

const FitnessTesting: React.FC<FitnessTestingProps> = ({navigation}) => {
  return (
    <Layout style={{flex: 1}}>
      {tests.map(({title, image, delay}, index) => {
        return (
          <TouchableOpacity key={title} style={{flex: 1}}>
            <ImageLoader
              style={{width: '100%', flex: 1}}
              delay={delay}
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
                {title}
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
