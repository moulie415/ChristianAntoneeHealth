import {RouteProp} from '@react-navigation/native';
import RenderHtml from 'react-native-render-html';
import Image from 'react-native-fast-image';
import React from 'react';
import {ScrollView, StyleSheet, useWindowDimensions, View} from 'react-native';
import {StackParamList} from '../../../App';
import DevicePixels from '../../../helpers/DevicePixels';
import moment from 'moment';
import {getEducationCategoryString} from '../../../helpers';
import Text from '../../commons/Text';
import Header from '../../commons/Header';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../../../constants/colors';

const EducationArticle: React.FC<{
  route: RouteProp<StackParamList, 'EducationArticle'>;
}> = ({route}) => {
  const {education} = route.params;
  const {width} = useWindowDimensions();
  return (
    <View>
      <ScrollView contentContainerStyle={{}}>
        <Image
          style={{
            height: DevicePixels[350],
            marginBottom: DevicePixels[10],
          }}
          source={{uri: education.image.src}}>
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: '#000',
              opacity: 0.7,
            }}
          />
        </Image>

        <Header hasBack absolute />

        <View
          style={{
            padding: DevicePixels[20],
            borderTopLeftRadius: DevicePixels[30],
            borderTopRightRadius: DevicePixels[30],
            marginTop: -DevicePixels[35],
            backgroundColor: colors.appWhite,
          }}>
          <Text
            style={{
              fontSize: DevicePixels[20],
              fontWeight: 'bold',
              marginBottom: DevicePixels[10],
            }}>
            {education.title}
          </Text>
          <Text style={{fontSize: DevicePixels[12]}}>{`${moment(
            education.createdate,
          ).format('DD MMMM YYYY')}   |   ${getEducationCategoryString(
            education.category,
          )}`}</Text>

          <RenderHtml contentWidth={width} source={{html: education.body}} />
        </View>
      </ScrollView>
    </View>
  );
};

export default EducationArticle;
