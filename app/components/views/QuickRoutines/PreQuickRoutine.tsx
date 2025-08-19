import {RouteProp, useIsFocused} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import * as _ from 'lodash';
import React, {useEffect, useMemo, useState} from 'react';
import {Image, ImageBackground, StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome6';
import Video, {ResizeMode} from 'react-native-video';
import convertToProxyURL from 'react-native-video-cache';
import {StackParamList} from '../../../App';
import colors from '../../../constants/colors';
import {capitalizeFirstLetter, getVideoHeight} from '../../../helpers';
import {startWatchWorkout} from '../../../helpers/biometrics';
import {getWorkoutDurationRounded} from '../../../helpers/getWorkoutDurationRounded';
import {useAppDispatch, useAppSelector} from '../../../hooks/redux';
import {updateProfile} from '../../../reducers/profile';
import {Equipment} from '../../../types/Shared';
import Button from '../../commons/Button';
import EquipmentList from '../../commons/EquipmentList';
import Header from '../../commons/Header';
import Text from '../../commons/Text';
import Toggle from '../../commons/Toggle';

const PreQuickRoutine: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'PreQuickRoutine'>;
  route: RouteProp<StackParamList, 'PreQuickRoutine'>;
}> = ({route, navigation}) => {
  const {prepTime, workoutMusic} = useAppSelector(
    state => state.profile.profile,
  );

  const exercisesObj = useAppSelector(state => state.exercises.exercises);

  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const {
    routine: {
      name,
      thumbnail,
      area,
      equipment,
      level,
      exerciseIds,
      preview,
      disableWorkoutMusic,
    },
  } = route.params;
  const exercises = useMemo(() => {
    return exerciseIds.map(id => {
      return typeof id === 'string'
        ? exercisesObj[id]
        : {...exercisesObj[id.id], ...id};
    });
  }, [exercisesObj, exerciseIds]);

  const duration = getWorkoutDurationRounded(exercises, prepTime);

  const equipmentList = _.uniq(
    exercises.reduce((acc: Equipment[], cur) => {
      if (cur?.equipment) {
        return [...acc, ...cur.equipment];
      }
      return acc;
    }, []),
  );

  const [paused, setPaused] = useState(false);
  const focused = useIsFocused();

  const [wMusic, setWMusic] = useState(workoutMusic);

  useEffect(() => {
    if (wMusic !== workoutMusic) {
      dispatch(updateProfile({workoutMusic: wMusic, disableSnackbar: true}));
    }
  }, [wMusic, workoutMusic, dispatch]);

  useEffect(() => {
    if (focused) {
      setPaused(false);
    } else {
      setPaused(true);
    }
  }, [focused]);

  return (
    <>
      {preview?.src ? (
        <>
          <Video
            source={{uri: convertToProxyURL(preview.src)}}
            style={{height: getVideoHeight(), width: '100%'}}
            resizeMode={ResizeMode.COVER}
            repeat
            disableFocus
            paused={paused}
          />
          <Header absolute hasBack />
        </>
      ) : (
        <ImageBackground
          source={{uri: thumbnail?.src}}
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
        </ImageBackground>
      )}

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
          {name}
        </Text>
        {!!duration && (
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
        )}
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
          <Text style={{color: colors.appWhite, flex: 1}}>{`${
            exerciseIds.length
          } ${exerciseIds.length > 1 ? 'exercises' : 'exercise'} `}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 10,
          }}>
          <View style={{width: 55, alignItems: 'center'}}>
            <Icon
              name="gauge-high"
              size={22}
              color={colors.appWhite}
              style={{
                marginHorizontal: 15,
              }}
            />
          </View>
          <Text style={{color: colors.appWhite, flex: 1}}>
            {capitalizeFirstLetter(level)}
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
              ? `${capitalizeFirstLetter(equipment)} equipment `
              : 'No equipment needed'}
            <EquipmentList equipment={equipmentList} />
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
          <Text
            style={{color: colors.appWhite, flex: 1}}>{`${capitalizeFirstLetter(
            area,
          )} body`}</Text>
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
          <Text style={{color: colors.appWhite, flex: 1}}>
            {disableWorkoutMusic
              ? 'Disabled for this workout'
              : 'Workout music'}
          </Text>
          <Toggle
            style={{marginRight: 20}}
            value={disableWorkoutMusic ? false : wMusic}
            disabled={disableWorkoutMusic}
            onValueChange={setWMusic}
          />
        </View>

        <Button
          style={{margin: 15}}
          text="Let's go!"
          onPress={() => {
            navigation.navigate('QuickRoutine', {
              routine: route.params.routine,
              startTime: new Date(),
            });
            startWatchWorkout();
          }}
        />
      </ScrollView>
    </>
  );
};

export default PreQuickRoutine;
