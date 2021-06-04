import {RouteProp} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import {StackParamList} from '../../App';
import Profile from '../Profile';
import {SignUpPayload} from '../../actions/profile';

type SignUpFlowNavigationProp = StackNavigationProp<
  StackParamList,
  'SignUpFlow'
>;
type SignUpFlowRouteProp = RouteProp<StackParamList, 'SignUpFlow'>;

export default interface SignUpFlowProps {
  navigation: SignUpFlowNavigationProp;
  route: SignUpFlowRouteProp;
  profile: Profile;
  signUp: (payload: SignUpPayload) => void;
}
