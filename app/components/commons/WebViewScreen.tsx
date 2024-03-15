import {RouteProp} from '@react-navigation/native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import {StackParamList} from '../../App';
import colors from '../../constants/colors';
import Header from './Header';

const WebViewScreen: React.FC<{
  route: RouteProp<StackParamList, 'WebViewScreen'>;
}> = ({route}) => {
  const {uri, title} = route.params;
  console.log(uri);
  return (
    <SafeAreaView style={{backgroundColor: colors.appGrey, flex: 1}}>
      <Header hasBack title={title} />

      <WebView source={{uri}} style={{flex: 1}} />
    </SafeAreaView>
  );
};

export default WebViewScreen;
