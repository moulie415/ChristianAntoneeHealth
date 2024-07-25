import React from 'react';
import {View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {RootState} from '../../../App';
import {resetToTabs} from '../../../RootNavigation';
import colors from '../../../constants/colors';
import {useBackHandler} from '../../../hooks/UseBackHandler';
import QuickRoutineSummaryProps from '../../../types/views/QuickRoutineSummary';
import Button from '../../commons/Button';
import WorkoutSummaryInfo from '../../commons/WorkoutSummaryInfo';

const QuickRoutineSummary: React.FC<QuickRoutineSummaryProps> = ({
  route,
  navigation,
  profile,
}) => {
  const {savedQuickRoutine, routine, saved} = route.params;
  useBackHandler(() => true);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.appGrey}}>
      <WorkoutSummaryInfo
        calories={savedQuickRoutine.calories}
        difficulty={savedQuickRoutine.difficulty}
        seconds={savedQuickRoutine.seconds}
        averageHeartRate={savedQuickRoutine.averageHeartRate}
      />

      {saved ? (
        <View style={{flexDirection: 'row'}}>
          <Button
            variant="secondary"
            text="Back"
            onPress={() => navigation.goBack()}
            style={{
              margin: 20,
              marginRight: 10,
              flex: 1,
            }}
          />
          <Button
            variant="secondary"
            text="Retry workout"
            onPress={() =>
              navigation.navigate('PreQuickRoutine', {
                routine,
              })
            }
            style={{
              margin: 20,
              marginLeft: 10,
              flex: 1,
            }}
          />
        </View>
      ) : (
        <Button
          text="Return Home"
          onPress={resetToTabs}
          style={{
            margin: 20,
            marginTop: 10,
          }}
        />
      )}
    </SafeAreaView>
  );
};

const mapStateToProps = ({profile}: RootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(QuickRoutineSummary);
