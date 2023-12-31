import {View, Text, SafeAreaView} from 'react-native';
import React from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../../../App';
import {RouteProp} from '@react-navigation/native';
import colors from '../../../../constants/colors';
import Header from '../../../commons/Header';
import convertToProxyURL from 'react-native-video-cache';
import Video from 'react-native-video';

const VideoView: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'VideoView'>;
  route: RouteProp<StackParamList, 'VideoView'>;
}> = ({navigation, route}) => {
  const {message} = route.params;
  return (
    <SafeAreaView style={{backgroundColor: colors.appGrey, flex: 1}}>
      <Header hasBack />
      <View style={{justifyContent: 'center', flex: 1}}>
        <Video
          style={{width: '100%', height: 300, marginTop: -80}}
          muted
          controls
          source={{uri: convertToProxyURL(message.video || '')}}
        />
      </View>
    </SafeAreaView>
  );
};

export default VideoView;
