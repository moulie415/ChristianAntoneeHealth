import {RouteProp} from '@react-navigation/core';
import {StackParamList} from '../../App';

type EducationWebViewRouteProp = RouteProp<StackParamList, 'EducationWebView'>;

export default interface EducationWebViewProps {
  route: EducationWebViewRouteProp;
};
