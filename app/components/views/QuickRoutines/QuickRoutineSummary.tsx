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
import {Profile} from '../../../types/Shared';
import BackButton from '../../commons/BackButton';
import Button from '../../commons/Button';
import Text from '../../commons/Text';
import WorkoutSummaryInfo from '../../commons/WorkoutSummaryInfo';

const QuickRoutineSummary: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'QuickRoutineSummary'>;
  route: RouteProp<StackParamList, 'QuickRoutineSummary'>;
  profile: Profile;
}> = ({route, navigation, profile}) => {
  const {savedQuickRoutine, routine, saved} = route.params;

  useBackHandler(() => true);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.appGrey}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          zIndex: 1,
        }}>
        {saved ? (
          <BackButton style={{margin: 20}} onPress={navigation.goBack} />
        ) : (
          <View style={{width: 40, height: 40, margin: 20}} />
        )}
        <Text
          numberOfLines={1}
          style={{
            color: colors.appWhite,
            fontSize: 25,
            fontWeight: 'bold',
            flex: 1,
            textAlign: saved ? 'left' : 'center',
          }}>
          Workout Summary
        </Text>
      </View>
      <WorkoutSummaryInfo
        calories={savedQuickRoutine.calories}
        difficulty={savedQuickRoutine.difficulty}
        seconds={savedQuickRoutine.seconds}
        averageHeartRate={savedQuickRoutine.averageHeartRate}
      />

      <View style={{flexDirection: 'row'}}>
        {saved && (
          <Button
            variant="secondary"
            text="Retry workout"
            onPress={() => {
              navigation.navigate('PreQuickRoutine', {
                routine,
              });
            }}
            style={{
              margin: 20,
              marginRight: 10,
              flex: 1,
            }}
          />
        )}

        {!saved && (
          <Button
            variant="secondary"
            text="Return Home"
            onPress={resetToTabs}
            style={{
              margin: 20,
              flex: 1,
              marginRight: 10,
            }}
          />
        )}
        <Button
          style={{margin: 20, marginLeft: 10, flex: 1}}
          onPress={() =>
            navigation.navigate('WorkoutBreakdown', {
              workout: savedQuickRoutine,
            })
          }
          text="View breakdown"
        />
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = ({profile}: RootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(QuickRoutineSummary);
