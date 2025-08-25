import { RouteProp } from '@react-navigation/native';
import React from 'react';
import Pdf from 'react-native-pdf';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackParamList } from '../../App';
import colors from '../../constants/colors';
import Header from './Header';
import Loader from './Loader';

const PDFViewer: React.FC<{
  route: RouteProp<StackParamList, 'PDFViewer'>;
}> = ({ route }) => {
  const { uri, title } = route.params;

  return (
    <SafeAreaView style={{ backgroundColor: colors.appGrey, flex: 1 }}>
      <Header hasBack title={title} />

      <Pdf
        renderActivityIndicator={() => <Loader />}
        source={{ uri, cache: true }}
        style={{ flex: 1 }}
      />
    </SafeAreaView>
  );
};

export default PDFViewer;
