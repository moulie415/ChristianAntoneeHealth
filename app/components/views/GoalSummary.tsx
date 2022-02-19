import React, {ReactNode, useEffect, useMemo} from 'react';
import {Goal, MyRootState} from '../../types/Shared';
import Profile from '../../types/Profile';
import {connect} from 'react-redux';
import {setViewedSummary} from '../../actions/profile';
import {Divider, Layout} from '@ui-kitten/components';
import Text from '../commons/Text';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Alert, TextStyle, TouchableOpacity, View} from 'react-native';
import DevicePixels from '../../helpers/DevicePixels';
import colors from '../../constants/colors';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';

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

  // const getTitle = () => {
  //   if (goal === Goal.BONE_DENSITY) {
  //     return 'Lets make your bones stronger!';
  //   }
  //   if (goal === Goal.CORE) {
  //     return 'Lets get your core slim and strong!';
  //   }
  //   return 'Lets keep you strong and lean!';
  // };

  // const workoutCount = useMemo(() => {
  //   if (goal === Goal.WEIGHT) {
  //     return 4;
  //   }
  //   return 3;
  // }, [goal]);

  // const timeExercising = useMemo(() => {
  //   if (goal === Goal.WEIGHT) {
  //     return '120 min';
  //   }
  //   return '90 min';
  // }, [goal]);

  // const intensityText = useMemo(() => {
  //   let intensity = '';
  //   if (goal === Goal.BONE_DENSITY || goal === Goal.CORE) {
  //     intensity = 'moderate - hard';
  //   } else {
  //     intensity = 'hard - very hard';
  //   }
  //   return `Total time spent in ${intensity} intensity category`;
  // }, [goal]);

  // const intensityTime = useMemo(() => {
  //   if (goal === Goal.WEIGHT) {
  //     return '90 min';
  //   }
  //   return '60 min';
  // }, [goal]);

  return (
    <Layout style={{flex: 1}}>
      {/* <Text
        style={{padding: DevicePixels[20], textAlign: 'center'}}
        category="h4">
        {getTitle()}
      </Text>
      <Text
        style={{textAlign: 'center', marginBottom: DevicePixels[20]}}
        category="s1">
        Here's your weekly plan...
      </Text>
      <Divider style={{marginBottom: DevicePixels[10]}} />
      <Row left="Number of workouts" right={workoutCount} />

      <Row left="Total time spent exercising" right={timeExercising} />
      <Row left={intensityText} right={intensityTime} />
      {goal === Goal.WEIGHT && (
        <>
          <Row
            onPress={() => {
              Alert.alert(
                'How to calculate BMI',
                'Body Mass Index (or BMI) is calculated as your weight (in kilograms) divided by the square of your height (in metres) or BMI = Kg/M2',
              );
            }}
            left="BMI"
            leftStyle={{textDecorationLine: 'underline', fontWeight: 'bold'}}
            right="18.5 - 24.9"
          />
          <Row left="Number of calories burned" right="3,500 kcal" />
          <Row
            left="We also suggest a healthy eating plan to maximize you benefit"
            icon="exclamation"
            iconStyle={{fontSize: 20}}
          />
        </>
      )}
      {goal === Goal.BONE_DENSITY && (
        <>
          <Row left="Number of weight bearing exercises performed" right={50} />
          <Row
            customLeft={
              <Text>
                We also suggest having a{' '}
                <Text
                  style={{textDecorationLine: 'underline', fontWeight: 'bold'}}>
                  DEXA
                </Text>{' '}
                scan performed as part of your plan
              </Text>
            }
            right=">-1"
          />
        </>
      )}
      {goal === Goal.CORE && (
        <>
          <Row left="Number of core exercises performed" right={30} />
          <Row
            onPress={() => {
              Alert.alert('Quick routine not implemented yet');
              //navigation.navigate('GoalSummary', {});
            }}
            customLeft={
              <Text>
                We also suggest{' '}
                <Text
                  style={{
                    fontWeight: 'bold',
                    textDecorationLine: 'underline',
                  }}>
                  hip and low back stretches
                </Text>{' '}
                for optimum function
              </Text>
            }
            icon="exclamation"
            iconStyle={{fontSize: 20}}
          />
        </>
      )} */}
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
