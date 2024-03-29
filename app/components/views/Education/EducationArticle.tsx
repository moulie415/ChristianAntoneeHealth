import {RouteProp} from '@react-navigation/native';
import RenderHtml from 'react-native-render-html';
import Image from 'react-native-fast-image';
import React from 'react';
import {ScrollView, StyleSheet, useWindowDimensions, View} from 'react-native';
import {StackParamList} from '../../../App';

import moment from 'moment';
import {getEducationCategoryString} from '../../../helpers';
import Text from '../../commons/Text';
import Header from '../../commons/Header';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../../../constants/colors';
import {AnimatedScrollView} from '@kanelloc/react-native-animated-header-scroll-view';

const EducationArticle: React.FC<{
  route: RouteProp<StackParamList, 'EducationArticle'>;
}> = ({route}) => {
  const {education} = route.params;
  const {width} = useWindowDimensions();
  return (
    <AnimatedScrollView
      HeaderNavbarComponent={<Header hasBack absolute />}
      topBarHeight={0}
      TopNavBarComponent={null}
      headerImage={{uri: education.image.src}}>
      <View
        style={{
          padding: 20,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          marginTop: -35,
          backgroundColor: colors.appWhite,
        }}>
        <Text
          style={{
            fontSize: 25,
            fontWeight: 'bold',
            marginBottom: 10,
            fontFamily: 'Helvetica',
          }}>
          {education.title}
        </Text>
        <Text style={{fontSize: 12, fontFamily: 'Helvetica'}}>{`${moment(
          education.createdate,
        ).format('DD MMMM YYYY')}   |   ${getEducationCategoryString(
          education.category,
        )}`}</Text>

        <RenderHtml contentWidth={width} source={{html: education.body}} />
      </View>
    </AnimatedScrollView>
    // <View>
    //   <ScrollView bounces={false} contentContainerStyle={{}}>
    //     <Image
    //       style={{
    //         height: 350,
    //         marginBottom: 10,
    //       }}
    //       source={{uri: education.image.src}}>
    //       <View
    //         style={{
    //           ...StyleSheet.absoluteFillObject,
    //           backgroundColor: '#000',
    //           opacity: 0.4,
    //         }}
    //       />
    //     </Image>

    //     <Header hasBack absolute />

    //     <View
    //       style={{
    //         padding: 20,
    //         borderTopLeftRadius: 30,
    //         borderTopRightRadius: 30,
    //         marginTop: -35,
    //         backgroundColor: colors.appWhite,
    //       }}>
    //       <Text
    //         style={{
    //           fontSize: 25,
    //           fontWeight: 'bold',
    //           marginBottom: 10,
    //           fontFamily: 'Helvetica',
    //         }}>
    //         {education.title}
    //       </Text>
    //       <Text style={{fontSize: 12, fontFamily: 'Helvetica'}}>{`${moment(
    //         education.createdate,
    //       ).format('DD MMMM YYYY')}   |   ${getEducationCategoryString(
    //         education.category,
    //       )}`}</Text>

    //       <RenderHtml contentWidth={width} source={{html: education.body}} />
    //     </View>
    //   </ScrollView>
    // </View>
  );
};

export default EducationArticle;
