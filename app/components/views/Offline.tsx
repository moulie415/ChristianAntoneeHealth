import auth from '@react-native-firebase/auth';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {Alert, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FontAwesome6} from '@react-native-vector-icons/fontawesome6';
import {StackParamList} from '../../App';
import colors from '../../constants/colors';
import {useAppDispatch} from '../../hooks/redux';
import {handleAuth} from '../../reducers/profile';
import Button from '../commons/Button';
import Header from '../commons/Header';
import Text from '../commons/Text';

const Offline: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'Offline'>;
}> = ({navigation}) => {
  const dispatch = useAppDispatch();

  const retry = () => {
    const user = auth().currentUser;
    if (user) {
      navigation.navigate('Loading');
      dispatch(handleAuth(user));
    } else {
      navigation.goBack();
      Alert.alert(
        'Error',
        'Current user not found, please try logging in again',
      );
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.appGrey}}>
      <Header hasBack />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: 100,
            height: 100,
            backgroundColor: colors.borderColor,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <FontAwesome6
            style={{position: 'absolute'}}
            name="plug-circle-xmark"
            color={colors.appBlue}
            iconStyle="solid"
            size={50}
          />
        </View>
        <Text
          style={{
            textAlign: 'center',
            margin: 20,
            fontSize: 25,
            fontWeight: 'bold',
            color: colors.appWhite,
          }}>
          Something went wrong
        </Text>

        <View style={{marginHorizontal: 20, width: 275}}>
          <Text
            style={{
              color: colors.offWhite,
              fontSize: 12,
              lineHeight: 20,
              textAlign: 'center',
            }}>
            It seems you are offline, please check your internet connection and
            try again.
          </Text>
        </View>
      </View>

      <Button onPress={retry} text="try again" style={{margin: 20}} />
    </SafeAreaView>
  );
};

export default Offline;
