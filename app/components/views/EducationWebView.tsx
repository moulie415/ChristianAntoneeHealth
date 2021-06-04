import React, {FunctionComponent} from 'react';
import WebView from 'react-native-webview';
import EducationWebViewProps from '../../types/views/EducationWebView';

const EducationWebView: FunctionComponent<EducationWebViewProps> = ({
  route,
}) => {
  const {url} = route.params;
  return <WebView source={{uri: url}} startInLoadingState />;
};

export default EducationWebView;
