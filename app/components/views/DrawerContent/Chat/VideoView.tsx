import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Video from 'react-native-video';
import { StackParamList } from '../../../../App';
import colors from '../../../../constants/colors';
import Header from '../../../commons/Header';

const VideoView: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'VideoView'>;
  route: RouteProp<StackParamList, 'VideoView'>;
}> = ({ navigation, route }) => {
  const { message } = route.params;
  return (
    <SafeAreaView style={{ backgroundColor: colors.appGrey, flex: 1 }}>
      <Header hasBack />
      <View style={{ justifyContent: 'center', flex: 1 }}>
        <Video
          style={{ width: '100%', height: 300, marginTop: -80 }}
          controls
          source={{ uri: message.video || '' }}
        />
      </View>
    </SafeAreaView>
  );
};

export default VideoView;
