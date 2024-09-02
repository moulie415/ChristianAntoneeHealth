import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {StackParamList} from '../../App';
import colors from '../../constants/colors';
import {capitalizeFirstLetter} from '../../helpers';
import {useAppDispatch, useAppSelector} from '../../hooks/redux';
import Fire from '../../images/fire.svg';
import Time from '../../images/time.svg';
import {setHasViewedTargets} from '../../reducers/profile';
import Button from '../commons/Button';
import ModalExitButton from '../commons/ModalExitButton';
import Text from '../commons/Text';

const Goals: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'TargetModal'>;
}> = ({navigation}) => {
  const {profile} = useAppSelector(state => state.profile);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setHasViewedTargets());
  }, [dispatch]);
  const goalData = profile.targets;
  const workoutGoal = goalData?.workouts.number;
  const minsGoal = goalData?.mins;
  const workoutLevelTitleString = capitalizeFirstLetter(
    goalData?.workouts.level || '',
  );
  const caloriesGoal = goalData?.calories || 0;
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.appGrey}}>
      <ModalExitButton />
      <View style={{flex: 1, justifyContent: 'center', marginHorizontal: 20}}>
        <Text
          style={{
            color: colors.appWhite,
            fontSize: 25,
            textAlign: 'center',
            marginBottom: 20,
          }}>
          Here are your weekly targets...
        </Text>
        <View style={{alignItems: 'center', marginVertical: 20}}>
          <Time />
          <Text
            style={{
              color: colors.appWhite,
              fontSize: 16,
              marginTop: 10,
              marginBottom: 40,
              textAlign: 'center',
            }}>
            {'Spend '}
            <Text style={{fontWeight: 'bold'}}>{minsGoal}</Text>
            {' minutes training'}
          </Text>
          <Icon
            name="gauge-high"
            size={25}
            color={colors.button}
            style={{
              marginHorizontal: 15,
            }}
          />
          <Text
            style={{
              color: colors.appWhite,
              fontSize: 16,
              marginTop: 10,
              marginBottom: 40,
              textAlign: 'center',
            }}>
            {'Complete '}
            <Text
              style={{
                fontWeight: 'bold',
              }}>{`${workoutGoal} `}</Text>
            {`${workoutLevelTitleString} workouts`}
          </Text>
          <Fire />
          <Text
            style={{
              color: colors.appWhite,
              fontSize: 16,
              marginTop: 10,
              marginBottom: 20,
              textAlign: 'center',
            }}>
            {'Burn '}
            <Text style={{fontWeight: 'bold'}}>{caloriesGoal}</Text>
            {' calories'}
          </Text>
        </View>
        <Text
          style={{
            color: colors.appWhite,
            fontSize: 16,
            marginTop: 10,
            marginBottom: 20,
            textAlign: 'center',
          }}>
          These targets can be viewed anytime from the profile tab
        </Text>
      </View>
      <Button text="Close" style={{margin: 20}} onPress={navigation.goBack} />
    </SafeAreaView>
  );
};

export default Goals;
