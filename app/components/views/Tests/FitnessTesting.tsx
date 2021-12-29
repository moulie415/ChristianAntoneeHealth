import React, {useRef, useState} from 'react';
import FitnessTestingProps from '../../../types/views/FitnessTesting';
import {
  TouchableOpacity,
  View,
  ImageSourcePropType,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import {MyRootState} from '../../../types/Shared';
import {connect} from 'react-redux';
import {Layout, Text} from '@ui-kitten/components';
import globalStyles from '../../../styles/globalStyles';
import ImageLoader from '../../commons/ImageLoader';
import DevicePixels from '../../../helpers/DevicePixels';
import {getTestImage} from '../../../helpers/images';
import colors from '../../../constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome5';

const {height} = Dimensions.get('window');

const FitnessTesting: React.FC<FitnessTestingProps> = ({
  navigation,
  tests,
  profile,
}) => {
  const items: {
    name: string;
    image: ImageSourcePropType;
    id: string;
    premium: boolean;
  }[] = tests
    ? Object.values(tests).map(({name, id, premium}) => {
        return {name, image: getTestImage(name), id, premium};
      })
    : [];
  const [showButton, setShowButton] = useState(true);
  const ref = useRef<ScrollView>(null);
  return (
    <Layout style={{flex: 1}}>
      <ScrollView ref={ref} onScroll={() => setShowButton(false)}>
        {items.map(({name, image, id, premium}, index) => {
          return (
            <TouchableOpacity
              onPress={() => {
                if (premium && !profile.premium) {
                  navigation.navigate('Premium');
                } else {
                  navigation.navigate('Test', {id});
                }
              }}
              key={name}
              style={{
                height:
                  height / 4 -
                  (Platform.OS === 'ios' ? DevicePixels[20] : DevicePixels[15]),
                marginBottom: DevicePixels[5],
              }}>
              <ImageLoader
                style={{width: '100%', flex: 1}}
                delay={index * 200}
                resizeMode="cover"
                source={image}
                overlay
              />
              {premium && !profile.premium && (
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Icon name="lock" color="#fff" size={DevicePixels[40]} />
                </View>
              )}
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  ...(index % 2 == 0 ? {right: 0} : {}),
                  margin: DevicePixels[1],
                }}>
                <Text
                  category="h5"
                  style={[globalStyles.textShadow, {color: '#fff'}]}>
                  {name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {showButton && (
        <TouchableOpacity
          onPress={() => {
            ref.current?.scrollToEnd();
            setShowButton(false);
          }}
          style={{
            width: DevicePixels[50],
            height: DevicePixels[50],
            borderRadius: DevicePixels[25],
            backgroundColor: colors.appBlue,
            position: 'absolute',
            bottom: DevicePixels[10],
            right: DevicePixels[10],
            alignItems: 'center',
            justifyContent: 'center',
            ...globalStyles.boxShadow,
          }}>
          <Icon name="arrow-down" size={DevicePixels[20]} color="#fff" />
        </TouchableOpacity>
      )}
    </Layout>
  );
};

const mapStateToProps = ({tests, profile}: MyRootState) => ({
  tests: tests.tests,
  profile: profile.profile,
});

export default connect(mapStateToProps)(FitnessTesting);
