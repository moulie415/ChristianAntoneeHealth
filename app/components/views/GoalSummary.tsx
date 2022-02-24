import React, {ReactNode, useEffect, useMemo, useState} from 'react';
import {Goal, MyRootState} from '../../types/Shared';
import Profile from '../../types/Profile';
import {connect} from 'react-redux';
import {setViewedSummary} from '../../actions/profile';
import {Divider, Layout} from '@ui-kitten/components';
import Text from '../commons/Text';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  Alert,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import DevicePixels from '../../helpers/DevicePixels';
import colors from '../../constants/colors';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';
import LiquidProgress from '../commons/LiquidProgress';
import {waitMilliseconds} from '../../helpers';

const Row: React.FC<{
  right?: string | number;
  left?: string;
  icon?: string;
  onPress?: () => void;
  customLeft?: ReactNode;
  leftStyle?: TextStyle;
  rightStyle?: TextStyle;
  iconStyle?: any;
}> = ({
  right,
  left,
  icon,
  onPress,
  leftStyle,
  rightStyle,
  iconStyle,
  customLeft,
}) => {
  return (
    <>
      <TouchableOpacity
        disabled={!onPress}
        onPress={onPress}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: DevicePixels[20],
          marginBottom: DevicePixels[10],
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
          }}>
          <Icon
            name={icon || 'circle'}
            solid
            style={[
              {
                marginRight: DevicePixels[10],
                fontSize: DevicePixels[8],
              },
              iconStyle,
            ]}
          />
          {customLeft || (
            <Text
              style={[
                {
                  marginRight: DevicePixels[10],
                },
                leftStyle,
              ]}
              category="s1">
              {left}
            </Text>
          )}
        </View>
        <Text category="h6" style={[{color: colors.appBlue}, rightStyle]}>
          {right}
        </Text>
      </TouchableOpacity>
      <Divider style={{marginBottom: DevicePixels[10]}} />
    </>
  );
};

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
      for (let i = 0; i <= 1; i += 0.2) {
        setValue(i);
        await waitMilliseconds(1000);
      }
    };
    increment();
  }, []);

  return (
    <Layout style={{flex: 1}}>
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <LiquidProgress
          backgroundColor={'black'}
          frontWaveColor={colors.appBlue}
          backWaveColor={colors.appBlueFaded}
          fill={value}
          size={290}>
          <Animated.View
            style={{alignSelf: 'center', flexDirection: 'row', height: 70}}>
            <Text style={{color: 'white', fontSize: 47}}>
              {(value * 100).toFixed(2)}%
            </Text>
          </Animated.View>
        </LiquidProgress>
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
