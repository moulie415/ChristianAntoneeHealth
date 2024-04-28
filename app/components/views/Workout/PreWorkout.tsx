import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {connect} from 'react-redux';
import {RootState, StackParamList} from '../../../App';
import colors from '../../../constants/colors';
import {getVideoHeight} from '../../../helpers';
import {getEquipmentList, getMusclesList} from '../../../helpers/exercises';
import {getWorkoutDurationRounded} from '../../../helpers/getWorkoutDurationRounded';
import {useAppSelector} from '../../../hooks/redux';
import {updateProfile} from '../../../reducers/profile';
import Exercise from '../../../types/Exercise';
import {UpdateProfilePayload} from '../../../types/Shared';
import Button from '../../commons/Button';
import Header from '../../commons/Header';
import Toggle from '../../commons/Toggle';

const PreWorkout: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'PreWorkout'>;
  route: RouteProp<StackParamList, 'PreWorkout'>;
  workout: Exercise[];
  workoutMusic?: boolean;
  updateProfile: (payload: UpdateProfilePayload) => void;
}> = ({
  route,
  navigation,
  workout,
  workoutMusic,
  updateProfile: updateProfileAction,
}) => {
  const {planWorkout, planId} = route.params;

  const equipmentList = getEquipmentList(workout);
  const musclesList = getMusclesList(workout);

  const [wMusic, setWMusic] = useState(workoutMusic);

  useEffect(() => {
    if (wMusic !== workoutMusic) {
      updateProfileAction({workoutMusic: wMusic, disableSnackbar: true});
    }
  }, [wMusic, updateProfileAction, workoutMusic]);

  const {prepTime} = useAppSelector(state => state.profile.profile);

  const duration = getWorkoutDurationRounded(workout, prepTime);

  return (
    <>
      <FastImage
        source={require('../../../images/new_workout.jpeg')}
        style={{height: getVideoHeight()}}>
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: '#000',
            opacity: 0.5,
          }}
        />
        <SafeAreaView>
          <Header hasBack />
        </SafeAreaView>
      </FastImage>
      <ScrollView
        style={{
          flex: 1,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          marginTop: -30,
          backgroundColor: colors.appGrey,
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            color: colors.appWhite,
            textAlign: 'center',
            marginTop: 30,
            marginBottom: 10,
            fontSize: 20,
          }}>
          {planWorkout.name}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
          }}>
          <View style={{width: 55, alignItems: 'center'}}>
            <Icon
              name="stopwatch"
              size={25}
              color={colors.appWhite}
              style={{
                marginHorizontal: 15,
              }}
            />
          </View>
          <Text
            style={{color: colors.appWhite}}>{`Under ${duration} mins`}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
          }}>
          <View style={{width: 55, alignItems: 'center'}}>
            <Icon
              name="person-running"
              size={25}
              color={colors.appWhite}
              style={{
                marginHorizontal: 15,
              }}
            />
          </View>
          <Text style={{color: colors.appWhite}}>{`${workout.length} ${
            workout.length > 1 ? 'exercises' : 'exercise'
          } `}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
          }}>
          <View style={{width: 55, alignItems: 'center'}}>
            <Icon
              name="dumbbell"
              size={20}
              color={colors.appWhite}
              style={{
                marginHorizontal: 15,
              }}
            />
          </View>
          <Text style={{color: colors.appWhite, flex: 1}}>
            {equipmentList && equipmentList.length
              ? equipmentList.join(', ')
              : 'No equipment needed'}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
          }}>
          <View style={{width: 55, alignItems: 'center'}}>
            <Icon
              name="child"
              size={25}
              color={colors.appWhite}
              style={{
                marginHorizontal: 15,
              }}
            />
          </View>
          <Text style={{color: colors.appWhite, flex: 1}}>
            {musclesList && musclesList.length ? musclesList.join(', ') : ''}
          </Text>
        </View>
        {/* <ConnectedApps /> */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
          }}>
          <View style={{width: 55, alignItems: 'center'}}>
            <Icon
              name="music"
              size={25}
              color={colors.appWhite}
              style={{
                marginHorizontal: 15,
              }}
            />
          </View>
          <Text style={{color: colors.appWhite, flex: 1}}>Workout music</Text>
          <Toggle
            style={{marginRight: 20}}
            value={wMusic}
            onValueChange={setWMusic}
          />
        </View>
        <Button
          style={{margin: 15}}
          text="Start workout"
          onPress={() =>
            navigation.navigate('StartWorkout', {
              planWorkout,
              startTime: new Date(),
              planId,
            })
          }
        />
      </ScrollView>
    </>
  );
};

const mapStateToProps = ({exercises, profile}: RootState) => ({
  workout: exercises.workout,
  workoutMusic: profile.profile.workoutMusic,
});

const mapDispatchToProps = {
  updateProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(PreWorkout);
