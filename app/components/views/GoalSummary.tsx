import React, {useEffect, useMemo} from 'react';
import {Goal, MyRootState} from '../../types/Shared';
import Profile from '../../types/Profile';
import {connect} from 'react-redux';
import {setViewedSummary} from '../../actions/profile';
import {Divider, Layout} from '@ui-kitten/components';
import Text from '../commons/Text';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {View} from 'react-native';
import DevicePixels from '../../helpers/DevicePixels';
import colors from '../../constants/colors';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';

const Row: React.FC<{right: string | number; left: string; icon?: string}> = ({
  right,
  left,
  icon,
}) => {
  return (
    <>
      <View
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
            style={{marginRight: DevicePixels[10], fontSize: DevicePixels[8]}}
          />
          <Text
            style={{
              marginRight: DevicePixels[10],
            }}
            category="s1">
            {left}
          </Text>
        </View>
        <Text category="h6" style={{color: colors.appBlue}}>
          {right}
        </Text>
      </View>
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

  const getTitle = () => {
    if (goal === Goal.BONE_DENSITY) {
      return 'Lets make your bones stronger!';
    }
    if (goal === Goal.CORE) {
      return 'Lets get your core slim and strong!';
    }
    return 'Lets keep you strong and lean!';
  };

  const workoutCount = useMemo(() => {
    if (goal === Goal.WEIGHT) {
      return 4;
    }
    return 3;
  }, [goal]);

  const timeExercising = useMemo(() => {
    if (goal === Goal.WEIGHT) {
      return '120 min';
    }
    return '90 min';
  }, [goal]);

  const intensityText = useMemo(() => {
    let intensity = '';
    if (goal === Goal.BONE_DENSITY || goal === Goal.CORE) {
      intensity = 'moderate - hard';
    } else {
      intensity = 'hard - very hard';
    }
    return `Total time spent in ${intensity} intensity category`;
  }, [goal]);

  const intensityTime = useMemo(() => {
    if (goal === Goal.WEIGHT) {
      return '90 min';
    }
    return '60 min';
  }, [goal]);

  return (
    <Layout style={{flex: 1}}>
      <Text
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
