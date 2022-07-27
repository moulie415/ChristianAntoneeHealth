import {RouteProp} from '@react-navigation/native';
import RenderHtml from 'react-native-render-html';
import Image from 'react-native-fast-image';
import React from 'react';
import {ScrollView, useWindowDimensions, View} from 'react-native';
import {StackParamList} from '../../../App';
import DevicePixels from '../../../helpers/DevicePixels';
import moment from 'moment';
import {getEducationCategoryString} from '../../../helpers';
import Text from '../../commons/Text';

const EducationArticle: React.FC<{
  route: RouteProp<StackParamList, 'EducationArticle'>;
}> = ({route}) => {
  const {education} = route.params;
  const {width} = useWindowDimensions();
  return (
    <View>
      <ScrollView
        contentContainerStyle={{
          backgroundColor: '#fff',
          padding: DevicePixels[20],
        }}>
        <Text>{education.title}</Text>
        <Text>{`${moment(education.createdate).format(
          'DD MMMM YYYY',
        )}   |   ${getEducationCategoryString(education.category)}`}</Text>
        <Image
          style={{
            height: DevicePixels[250],
            marginTop: DevicePixels[20],
            marginBottom: DevicePixels[10],
          }}
          source={{uri: education.image.src}}
        />

        <RenderHtml contentWidth={width} source={{html: education.body}} />
      </ScrollView>
    </View>
  );
};

export default EducationArticle;
