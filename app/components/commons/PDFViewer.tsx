import {RouteProp} from '@react-navigation/native';
import React from 'react';
import Pdf from 'react-native-pdf';
import {SafeAreaView} from 'react-native-safe-area-context';
import Spinner from 'react-native-spinkit';
import {StackParamList} from '../../App';
import colors from '../../constants/colors';
import Header from './Header';

const PDFViewer: React.FC<{
  route: RouteProp<StackParamList, 'PDFViewer'>;
}> = ({route}) => {
  const {uri, title} = route.params;

  return (
    <SafeAreaView style={{backgroundColor: colors.appGrey, flex: 1}}>
      <Header hasBack title={title} />

      <Pdf
        renderActivityIndicator={() => <Spinner />}
        source={{uri, cache: true}}
        style={{flex: 1}}
      />
    </SafeAreaView>
  );
};

export default PDFViewer;
