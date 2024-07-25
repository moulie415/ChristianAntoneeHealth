import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {RootState, StackParamList} from '../../../App';
import {resetToTabs} from '../../../RootNavigation';
import colors from '../../../constants/colors';
import {useBackHandler} from '../../../hooks/UseBackHandler';
import Exercise from '../../../types/Exercise';
import {Profile} from '../../../types/Shared';
import Button from '../../commons/Button';
import WorkoutSummaryInfo from '../../commons/WorkoutSummaryInfo';

const WorkoutSummary: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'WorkoutSummary'>;
  route: RouteProp<StackParamList, 'WorkoutSummary'>;
  profile: Profile;
  workout: Exercise[];
}> = ({route, navigation}) => {
  const {savedWorkout, saved} = route.params;
  useBackHandler(() => true);
  const showBreakdown =
    !!savedWorkout.heartRateSamples.length ||
    !!savedWorkout.calorieSamples.length;
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.appGrey}}>
      <WorkoutSummaryInfo
        calories={savedWorkout.calories}
        difficulty={savedWorkout.difficulty}
        seconds={savedWorkout.seconds}
        averageHeartRate={savedWorkout.averageHeartRate}
      />

      <View style={{flexDirection: 'row'}}>
        {savedWorkout.planWorkout && saved && (
          <Button
            variant={showBreakdown ? 'secondary' : 'primary'}
            text="Retry workout"
            onPress={() => {
              if (savedWorkout.planWorkout) {
                navigation.navigate('PreWorkout', {
                  planWorkout: savedWorkout.planWorkout,
                  planId: savedWorkout.planId,
                });
              }
            }}
            style={{
              margin: 20,
              marginRight: showBreakdown ? 10 : 20,
              flex: 1,
            }}
          />
        )}

        {!saved && (
          <Button
            variant={showBreakdown ? 'secondary' : 'primary'}
            text="Return Home"
            onPress={resetToTabs}
            style={{
              margin: 20,
              flex: 1,
              marginRight: showBreakdown ? 10 : 20,
            }}
          />
        )}
        {showBreakdown && (
          <Button
            style={{margin: 20, marginLeft: showBreakdown ? 10 : 20, flex: 1}}
            onPress={() =>
              navigation.navigate('WorkoutBreakdown', {
                workout: savedWorkout,
              })
            }
            text="View breakdown"
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = ({profile, exercises}: RootState) => ({
  profile: profile.profile,
  workout: exercises.workout,
});

export default connect(mapStateToProps)(WorkoutSummary);
