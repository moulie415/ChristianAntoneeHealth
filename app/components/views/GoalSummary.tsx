import React, {useEffect, useState} from 'react';
import {MyRootState} from '../../types/Shared';
import Profile from '../../types/Profile';
import {connect} from 'react-redux';
import {setViewedSummary} from '../../actions/profile';
import {Layout} from '@ui-kitten/components';
import Text from '../commons/Text';
import {View} from 'react-native';
import DevicePixels from '../../helpers/DevicePixels';
import colors from '../../constants/colors';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';
import LiquidProgress from '../commons/LiquidProgress';
import {waitMilliseconds} from '../../helpers';
import Animated, {FadeIn} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome5';

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
}> = ({profile, setViewedSummary: setViewed, navigation}) => {
  const {goal} = profile;
  useEffect(() => {
    setViewed();
  }, [setViewed]);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const increment = async () => {
      for (let i = 0; i <= 4; i += 1) {
        setValue(i / 4);
        await waitMilliseconds(2000);
      }
    };
    increment();
  }, []);

  return (
    <Layout style={{flex: 1}}>
      <View
        style={{
          flex: 1,
        }}>
        <LiquidProgress
          backgroundColor={colors.appGrey}
          frontWaveColor={colors.appBlue}
          backWaveColor={colors.appBlueFaded}
          fill={value}
          size={DevicePixels[100]}>
          <Animated.View
            style={{
              height: 30,
              width: DevicePixels[100],
  
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: DevicePixels[20],
                textAlign: 'center',
              }}>
              {(value * 100).toFixed(0)}%
            </Text>
          </Animated.View>
        </LiquidProgress>
      </View>
      <View style={{flex: 4}}>
        <Text
          category="h4"
          style={{margin: DevicePixels[20], textAlign: 'center'}}>
          Creating your program
        </Text>
        {items.map((item, index) => {
          if (value * 4 > index) {
            return (
              <Animated.View
                entering={FadeIn.duration(1000)}
                key={item}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  margin: DevicePixels[10],
                }}>
                <Icon
                  name="check"
                  size={DevicePixels[15]}
                  style={{marginHorizontal: DevicePixels[10]}}
                />
                <Text style={{flex: 1}} category="h6">
                  {item}
                </Text>
              </Animated.View>
            );
          }
          return null;
        })}
      </View>
    </Layout>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

const mapDispatchToProps = {
  setViewedSummary,
};

export default connect(mapStateToProps, mapDispatchToProps)(GoalSummary);
