import {Card, Divider, Layout, ListItem, Text} from '@ui-kitten/components';
import React, {Fragment, useState} from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import DevicePixels from '../../../helpers/DevicePixels';
import globalStyles from '../../../styles/globalStyles';
import {
  CardioType,
  Goal,
  MyRootState,
  StrengthArea,
} from '../../../types/Shared';
import ImageLoader from '../../commons/ImageLoader';
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  setCardioType,
  setFitnessGoal,
  setStrengthArea,
} from '../../../actions/exercises';
import {connect} from 'react-redux';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../../App';
import colors from '../../../constants/colors';

const FitnessGoal: React.FC<{
  setFitnessGoalAction: (goal: Goal) => void;
  setStrengthAreaAction: (area: StrengthArea) => void;
  setCardioTypeAction: (type: CardioType) => void;
  fitnessGoal: Goal;
  strengthArea: StrengthArea;
  cardioType: CardioType;
  navigation: NativeStackNavigationProp<StackParamList, 'FitnessGoal'>;
}> = ({
  setFitnessGoalAction,
  setStrengthAreaAction,
  setCardioTypeAction,
  navigation,
  fitnessGoal,
  strengthArea,
  cardioType,
}) => {
  const sections: {
    title: string;
    key: Goal;
    image: ImageSourcePropType;
    items: {
      id: StrengthArea | CardioType;
      name: string;
      description: string;
      action: () => void;
    }[];
  }[] = [
    {
      title: 'Strength',
      key: Goal.STRENGTH,
      items: [
        {
          id: StrengthArea.UPPER,
          name: 'Upper body strength',
          description:
            'Target your abdominals, chest, back, arms and shoulders',
          action: () => {
            setFitnessGoalAction(Goal.STRENGTH);
            setStrengthAreaAction(StrengthArea.UPPER);
            navigation.goBack();
          },
        },
        {
          id: StrengthArea.LOWER,
          name: 'Lower body strength',
          description:
            'These exercises will consist largely of squats, lunges and deadlifts with lots of variations of each to enable you to emphasize certain areas such as your glutes, quads or hamstrings',
          action: () => {
            setFitnessGoalAction(Goal.STRENGTH);
            setStrengthAreaAction(StrengthArea.LOWER);
            navigation.goBack();
          },
        },
        {
          id: StrengthArea.FULL,
          name: 'Full body strength',
          description:
            'Choose from a list of exercises that work your upper body, lower and abdominal areas all at the same time',
          action: () => {
            setFitnessGoalAction(Goal.STRENGTH);
            setStrengthAreaAction(StrengthArea.FULL);
            navigation.goBack();
          },
        },
      ],
      image: require('../../../images/Quick_Routine_body_part.jpeg'),
    },
    {
      title: 'Cardiovascular fitness',
      key: Goal.CARDIO,
      items: [
        {
          id: CardioType.HIT,
          name: 'High intensity interval training',
          description:
            'Choose from a list of fast-paced exercises designed to get your heart and lungs going while breaking a good sweat',
          action: () => {
            setFitnessGoalAction(Goal.CARDIO);
            setCardioTypeAction(CardioType.SBIT);
            navigation.goBack();
          },
        },
        {
          id: CardioType.SBIT,
          name: 'Skill based interval training',
          description:
            'These movements will get you using different pieces of equipment such as bosu balls and agility ladders to get you breathing heavily while improving your balance, coordination, speed and reaction time.',
          action: () => {
            setFitnessGoalAction(Goal.CARDIO);
            setCardioTypeAction(CardioType.SBIT);
            navigation.goBack();
          },
        },
      ],
      image: require('../../../images/Quick_routine_training_focus.jpeg'),
    },
  ];
  const [itemsCollapsed, setItemsCollapsed] = useState<{
    [key: number]: boolean;
  }>(
    sections.reduce((acc, cur, index) => {
      return {...acc, [index]: true};
    }, {}),
  );
  return (
    <SafeAreaView style={{flex: 1}}>
      <Layout style={{flex: 1}}>
        {sections.map(({title, image, items, key}, index) => {
          return (
            <Fragment key={key}>
              <TouchableOpacity
                onPress={() => {
                  setItemsCollapsed({
                    0: index === 0 ? !itemsCollapsed[0] : true,
                    1: index === 1 ? !itemsCollapsed[1] : true,
                  });
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
              <Collapsible collapsed={itemsCollapsed[index]}>
                {items.map(({id, name, description, action}) => {
                  return (
                    <Fragment key={id}>
                      <ListItem
                        onPress={action}
                        title={name}
                        description={description}
                        accessoryLeft={() => {
                          return key === fitnessGoal &&
                            (id === strengthArea || id === cardioType) ? (
                            <Icon
                              name="check-circle"
                              size={DevicePixels[20]}
                              solid
                              color={colors.appBlue}
                            />
                          ) : (
                            <Icon
                              name="circle"
                              size={DevicePixels[20]}
                              color={colors.appBlue}
                            />
                          );
                        }}
                      />

                      <Divider />
                    </Fragment>
                  );
                })}
              </Collapsible>
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
  cardioType: exercises.cardioType,
});

const mapDispatchToProps = {
  setFitnessGoalAction: setFitnessGoal,
  setStrengthAreaAction: setStrengthArea,
  setCardioTypeAction: setCardioType,
};

export default connect(mapStateToProps, mapDispatchToProps)(FitnessGoal);
