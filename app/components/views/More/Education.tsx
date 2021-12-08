import {Layout, ListItem} from '@ui-kitten/components';
import React from 'react';
import Image from 'react-native-fast-image';
import DevicePixels from '../../../helpers/DevicePixels';
import EducationProps from '../../../types/views/Education';

const Education: React.FC<EducationProps> = ({navigation}) => {
  return (
    <Layout style={{flex: 1}}>
      <ListItem
        style={{}}
        accessoryLeft={() => (
          <Image
            source={require('../../../images/article1.jpeg')}
            style={{height: DevicePixels[100], width: DevicePixels[100]}}
          />
        )}
        title="Strawberry and Cacao Kefir Smoothie"
        description="9 Feb 2021"
        onPress={() =>
          navigation.navigate('EducationWebView', {
            url:
              'https://healthandmovement.co.uk/education/f/strawberry-and-cacao-kefir-smoothie',
          })
        }
      />
      <ListItem
        style={{}}
        accessoryLeft={() => (
          <Image
            source={require('../../../images/article2.jpeg')}
            style={{height: DevicePixels[100], width: DevicePixels[100]}}
          />
        )}
        title="Cross-Training For Runners"
        description="9 Feb 2021"
        onPress={() =>
          navigation.navigate('EducationWebView', {
            url:
              'https://healthandmovement.co.uk/education/f/cross-training-for-runners',
          })
        }
      />
      <ListItem
        style={{}}
        accessoryLeft={() => (
          <Image
            source={require('../../../images/article3.jpeg')}
            style={{height: DevicePixels[100], width: DevicePixels[100]}}
          />
        )}
        title="Lifting Heavy Weights Improves Running Performance"
        description="9 Feb 2021"
        onPress={() =>
          navigation.navigate('EducationWebView', {
            url:
              'https://healthandmovement.co.uk/education/f/lifting-heavy-weights-improves-running-performance',
          })
        }
      />
      <ListItem
        style={{}}
        accessoryLeft={() => (
          <Image
            source={require('../../../images/article4.jpeg')}
            style={{height: DevicePixels[100], width: DevicePixels[100]}}
          />
        )}
        title="A Simple Blueprint For Every Workout"
        description="9 Feb 2021"
        onPress={() =>
          navigation.navigate('EducationWebView', {
            url:
              'https://healthandmovement.co.uk/education/f/a-simple-blueprint-for-every-workout',
          })
        }
      />
    </Layout>
  );
};

export default Education;
