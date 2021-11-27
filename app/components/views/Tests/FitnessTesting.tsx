import React from 'react';
import FitnessTestingProps from '../../../types/views/FitnessTesting';
import {TouchableOpacity, View, ImageSourcePropType} from 'react-native';
import {MyRootState} from '../../../types/Shared';
import {connect} from 'react-redux';
import {Layout, Text} from '@ui-kitten/components';
import globalStyles from '../../../styles/globalStyles';
import ImageLoader from '../../commons/ImageLoader';
import DevicePixels from '../../../helpers/DevicePixels';
import {getTestImage} from '../../../helpers/images';

const FitnessTesting: React.FC<FitnessTestingProps> = ({navigation, tests}) => {
  const items: {name: string; image: ImageSourcePropType; id: string}[] = tests
    ? Object.values(tests).map(({name, id}) => {
        return {name, image: getTestImage(name), id};
      })
    : [];
  return (
    <Layout style={{flex: 1}}>
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
    </Layout>
  );
};

const mapStateToProps = ({tests}: MyRootState) => ({
  tests: tests.tests,
});

export default connect(mapStateToProps)(FitnessTesting);
