import React, {Fragment, useEffect, useState} from 'react';
import {Goal, MyRootState} from '../../types/Shared';
import Profile from '../../types/Profile';
import {connect} from 'react-redux';
import {setViewedSummary} from '../../actions/profile';
import {Divider} from '@ui-kitten/components';
import Text from '../commons/Text';
import {Platform, View} from 'react-native';
import DevicePixels from '../../helpers/DevicePixels';
import colors from '../../constants/colors';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';
import {waitMilliseconds} from '../../helpers';
import Animated, {FadeIn, FadeOut} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import Button from '../commons/Button';

const items = [
  'Evaluating your profile',
  'Building your workout plan',
  'Settings your weekly goals',
  'Determining your fitness/strength tests',
];

const GoalSummary: React.FC<{
  profile: Profile;
  setViewedSummary: () => void;
  navigation: NativeStackNavigationProp<StackParamList, 'GoalSummary'>;
  viewedSummary: boolean;
}> = ({profile, setViewedSummary: setViewed, navigation, viewedSummary}) => {
  const [showProgram, setShowProgram] = useState(viewedSummary);
  const {goal} = profile;
  const goalItems: {text: string; val: string}[] = [
    {
      text: 'Number of weekly training days',
      val: goal === Goal.STRENGTH ? '3' : '4',
    },
    {
      text: `Number of ${goal} exercises each week`,
      val: goal === Goal.STRENGTH ? '24' : '30',
    },
    {
      text: `Total time spent ${goal} training`,
      val: goal === Goal.STRENGTH ? '90min' : '150min',
    },
  ];

  useEffect(() => {
    setViewed();
  }, [setViewed]);
  const [value, setValue] = useState(viewedSummary ? 1 : 0);

  useEffect(() => {
    const increment = async () => {
      for (let i = 0; i <= 4; i += 1) {
        setValue(i / 4);
        await waitMilliseconds(2000);
        if (i === 4) {
          await waitMilliseconds(1000);
          setShowProgram(true);
        }
      }
    };
    if (!showProgram) {
      increment();
    }
  }, [showProgram]);

  return (
    <View style={{backgroundColor: colors.appWhite, flex: 1}}>
      {showProgram ? (
        <Animated.View entering={FadeIn.delay(500)} style={{flex: 1}}>
          <Text
            category="h4"
            style={{margin: DevicePixels[20], textAlign: 'center'}}>
            Your weekly program
          </Text>
          {goalItems.map((item, index) => {
            if (value * 4 > index) {
              return (
                <Fragment key={item.text}>
                  <Animated.View
                    entering={
                      Platform.OS === 'ios'
                        ? FadeIn.delay((index + 1) * 500)
                        : undefined
                    }>
                    {index === 0 && <Divider />}
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        margin: DevicePixels[10],
                      }}>
                      <Icon
                        name={goal === Goal.STRENGTH ? 'dumbbell' : 'heartbeat'}
                        size={DevicePixels[20]}
                        color={colors.appBlue}
                        style={{marginHorizontal: DevicePixels[10]}}
                      />
                      <Text style={{flex: 1}} category="h6">
                        {item.text}
                      </Text>
                      <Text
                        category="h6"
                        style={{
                          color: colors.appBlue,
                          marginHorizontal: DevicePixels[10],
                        }}>
                        {item.val}
                      </Text>
                    </View>
                    <Divider />
                  </Animated.View>
                </Fragment>
              );
            }
            return null;
          })}

          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            <Button
              onPress={() => navigation.navigate('Activity')}
              style={{margin: DevicePixels[20]}}>
              View progress
            </Button>
          </View>
        </Animated.View>
      ) : (
        <Animated.View
          entering={Platform.OS === 'ios' ? FadeIn.delay(500) : undefined}
          exiting={Platform.OS === 'ios' ? FadeOut.delay(500) : undefined}
          style={{flex: 1}}>
          <AnimatedCircularProgress
            style={{alignSelf: 'center', marginTop: DevicePixels[20]}}
            size={DevicePixels[120]}
            width={DevicePixels[15]}
            backgroundWidth={DevicePixels[5]}
            fill={value * 100}
            tintColor={colors.appBlue}
            tintColorSecondary={colors.appBlueFaded}
            backgroundColor={colors.appGrey}
            arcSweepAngle={240}
            rotation={240}
            lineCap="round">
            {fill => <Text category="h4">{`${fill.toFixed(0)} %`}</Text>}
          </AnimatedCircularProgress>

          <Text
            category="h4"
            style={{margin: DevicePixels[20], textAlign: 'center'}}>
            Creating your weekly program
          </Text>
          {items.map((item, index) => {
            if (value * 4 > index) {
              return (
                <Fragment key={item}>
                  <Animated.View
                    entering={
                      Platform.OS === 'ios' ? FadeIn.delay(1000) : undefined
                    }>
                    {index === 0 && <Divider />}
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        margin: DevicePixels[10],
                      }}>
                      <Icon
                        name="check"
                        size={DevicePixels[15]}
                        color={colors.appBlue}
                        style={{marginHorizontal: DevicePixels[10]}}
                      />
                      <Text style={{flex: 1}} category="h5">
                        {item}
                      </Text>
                    </View>
                    <Divider />
                  </Animated.View>
                </Fragment>
              );
            }
            return null;
          })}
        </Animated.View>
      )}
    </View>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
  viewedSummary: profile.viewedSummary,
});

const mapDispatchToProps = {
  setViewedSummary,
};

export default connect(mapStateToProps, mapDispatchToProps)(GoalSummary);
