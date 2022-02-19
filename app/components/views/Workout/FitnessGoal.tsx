import {Layout, Text} from '@ui-kitten/components';
import React, {Fragment} from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import DevicePixels from '../../../helpers/DevicePixels';
import globalStyles from '../../../styles/globalStyles';
import {Goal, MyRootState} from '../../../types/Shared';
import ImageLoader from '../../commons/ImageLoader';
import {setFitnessGoal, setStrengthArea} from '../../../actions/exercises';
import {connect} from 'react-redux';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../../App';

const FitnessGoal: React.FC<{
  setFitnessGoalAction: (goal: Goal) => void;
  navigation: NativeStackNavigationProp<StackParamList, 'FitnessGoal'>;
}> = ({setFitnessGoalAction, navigation}) => {
  const sections: {
    title: string;
    key: Goal;
    image: ImageSourcePropType;
    action: () => void;
  }[] = [
    {
      title: 'Improve my strength',
      key: Goal.STRENGTH,
      image: require('../../../images/Quick_routine_training_focus.jpeg'),
      action: () => setFitnessGoalAction(Goal.STRENGTH),
    },
    {
      title: 'Improve my fitness',
      key: Goal.FITNESS,
      image: require('../../../images/Homepage_activity_tracking.jpeg'),
      action: () => setFitnessGoalAction(Goal.FITNESS),
    },
  ];

  return (
    <SafeAreaView style={{flex: 1}}>
      <Layout style={{flex: 1}}>
        {sections.map(({title, image, action, key}) => {
          return (
            <Fragment key={key}>
              <TouchableOpacity
                onPress={() => {
                  action();
                  navigation.goBack();
                }}
                key={title}
                style={{flex: 1, marginBottom: DevicePixels[5]}}>
                <ImageLoader
                  source={image}
                  overlay
                  style={{width: '100%', flex: 1}}
                />

                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    top: 0,
                    left: DevicePixels[20],
                    justifyContent: 'center',
                  }}>
                  <Text
                    category="h5"
                    style={[globalStyles.textShadow, {color: '#fff'}]}>
                    {title}
                  </Text>
                </View>
              </TouchableOpacity>
            </Fragment>
          );
        })}
      </Layout>
    </SafeAreaView>
  );
};

const mapStateToProps = ({exercises}: MyRootState) => ({
  fitnessGoal: exercises.fitnessGoal,
  strengthArea: exercises.strengthArea,
});

const mapDispatchToProps = {
  setFitnessGoalAction: setFitnessGoal,
  setStrengthAreaAction: setStrengthArea,
};

export default connect(mapStateToProps, mapDispatchToProps)(FitnessGoal);
