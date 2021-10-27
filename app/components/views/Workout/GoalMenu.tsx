import {Divider, ListItem, Text} from '@ui-kitten/components';
import React from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Collapsible from 'react-native-collapsible';
import colors from '../../../constants/colors';
import DevicePixels from '../../../helpers/DevicePixels';
import {CardioType, Goal, StrengthArea} from '../../../types/Shared';

const GoalMenu: React.FC<{
  selectedGoal: Goal;
  setSelectedGoal: (goal: Goal) => void;
  selectedArea: StrengthArea;
  setSelectedArea: (area: StrengthArea) => void;
  selectedCardioType: CardioType;
  setSelectedCardioType: (type: CardioType) => void;
}> = ({
  selectedGoal,
  setSelectedGoal,
  selectedArea,
  setSelectedArea,
  selectedCardioType,
  setSelectedCardioType,
}) => {
  return (
    <View>
      <Text category="label" style={{margin: DevicePixels[10]}}>
        Goal setting is very important as it adds direction and structure to
        your training plan. Once you’ve identified your goals we can then plan
        how we are going to reach them. Choose below from either STRENGTH or
        CARDIOVASCULAR FITNESS based goals.
      </Text>
      <Divider />
      <ListItem
        onPress={() => setSelectedGoal(Goal.STRENGTH)}
        accessoryLeft={() =>
          selectedGoal === Goal.STRENGTH ? (
            <Icon
              size={DevicePixels[8]}
              color={colors.appBlue}
              name="circle"
              solid
            />
          ) : (
            <View style={{width: DevicePixels[8]}} />
          )
        }
        title={props => (
          <Text
            {...props}
            style={[
              props.style,
              selectedGoal === Goal.STRENGTH ? {color: colors.appBlue} : {},
            ]}>
            INCREASE YOUR STRENGTH
          </Text>
        )}
        description={props => (
          <Text
            {...props}
            style={[
              props.style,
              selectedGoal === Goal.STRENGTH ? {color: colors.appBlue} : {},
            ]}>
            The focus here will be on using large muscle groups such as your
            legs, shoulders and arms to engage in moderate – heavy resistance
            training usually under 10 repetitions
          </Text>
        )}
      />
      <Divider />
      <Collapsible
        style={{marginLeft: DevicePixels[20]}}
        collapsed={selectedGoal !== Goal.STRENGTH}>
        <ListItem
          onPress={() => setSelectedArea(StrengthArea.UPPER)}
          accessoryLeft={() =>
            selectedArea === StrengthArea.UPPER ? (
              <Icon
                size={DevicePixels[8]}
                color={colors.appBlue}
                name="circle"
                solid
              />
            ) : (
              <View style={{width: DevicePixels[8]}} />
            )
          }
          title={props => (
            <Text
              {...props}
              style={[
                props.style,
                selectedArea === StrengthArea.UPPER
                  ? {color: colors.appBlue}
                  : {},
              ]}>
              Upper Body Strength
            </Text>
          )}
          description={props => (
            <Text
              {...props}
              style={[
                props.style,
                selectedArea === StrengthArea.UPPER
                  ? {color: colors.appBlue}
                  : {},
              ]}>
              Will include compound and isolation exercises to target your
              abdominals, chest, back, arms and shoulders
            </Text>
          )}
        />
        <Divider />
        <ListItem
          onPress={() => setSelectedArea(StrengthArea.LOWER)}
          accessoryLeft={() =>
            selectedArea === StrengthArea.LOWER ? (
              <Icon
                size={DevicePixels[8]}
                color={colors.appBlue}
                name="circle"
                solid
              />
            ) : (
              <View style={{width: DevicePixels[8]}} />
            )
          }
          title={props => (
            <Text
              {...props}
              style={[
                props.style,
                selectedArea === StrengthArea.LOWER
                  ? {color: colors.appBlue}
                  : {},
              ]}>
              Lower Body Strength
            </Text>
          )}
          description={props => (
            <Text
              {...props}
              style={[
                props.style,
                selectedArea === StrengthArea.LOWER
                  ? {color: colors.appBlue}
                  : {},
              ]}>
              These exercises will consist largely of squats, lunges and
              deadlifts with lots of variations of each to enable you to
              emphasize certain areas such as your glutes, quads or hamstrings
            </Text>
          )}
        />
        <Divider />
        <ListItem
          onPress={() => setSelectedArea(StrengthArea.FULL)}
          accessoryLeft={() =>
            selectedArea === StrengthArea.FULL ? (
              <Icon
                size={DevicePixels[8]}
                color={colors.appBlue}
                name="circle"
                solid
              />
            ) : (
              <View style={{width: DevicePixels[8]}} />
            )
          }
          title={props => (
            <Text
              {...props}
              style={[
                props.style,
                selectedArea === StrengthArea.FULL
                  ? {color: colors.appBlue}
                  : {},
              ]}>
              Full Body Strength
            </Text>
          )}
          description={props => (
            <Text
              {...props}
              style={[
                props.style,
                selectedArea === StrengthArea.FULL
                  ? {color: colors.appBlue}
                  : {},
              ]}>
              Choose from a list of exercises that work your upper body, lower
              and abdominal areas all at the same time
            </Text>
          )}
        />
        <Divider />
      </Collapsible>
      <ListItem
        onPress={() => setSelectedGoal(Goal.CARDIO)}
        accessoryLeft={() =>
          selectedGoal === Goal.CARDIO ? (
            <Icon
              size={DevicePixels[8]}
              color={colors.appBlue}
              name="circle"
              solid
            />
          ) : (
            <View style={{width: DevicePixels[8]}} />
          )
        }
        title={props => (
          <Text
            {...props}
            style={[
              props.style,
              selectedGoal === Goal.CARDIO ? {color: colors.appBlue} : {},
            ]}>
            IMPROVE YOUR CARDIOVASCULAR FITNESS
          </Text>
        )}
        description={props => (
          <Text
            {...props}
            style={[
              props.style,
              selectedGoal === Goal.CARDIO ? {color: colors.appBlue} : {},
            ]}>
            These movement patterns will test and develop your anaerobic energy
            system, improve your metabolic conditioning, help you burn loads of
            calories, and improve your skill with various pieces of equipment
          </Text>
        )}
      />
      <Divider />
      <Collapsible
        style={{marginLeft: DevicePixels[20]}}
        collapsed={selectedGoal !== Goal.CARDIO}>
        <ListItem
          onPress={() => setSelectedCardioType(CardioType.HIT)}
          accessoryLeft={() =>
            selectedCardioType === CardioType.HIT ? (
              <Icon
                size={DevicePixels[8]}
                color={colors.appBlue}
                name="circle"
                solid
              />
            ) : (
              <View style={{width: DevicePixels[8]}} />
            )
          }
          title={props => (
            <Text
              {...props}
              style={[
                props.style,
                selectedCardioType === CardioType.HIT
                  ? {color: colors.appBlue}
                  : {},
              ]}>
              High Intensity Interval Training
            </Text>
          )}
          description={props => (
            <Text
              {...props}
              style={[
                props.style,
                selectedCardioType === CardioType.HIT
                  ? {color: colors.appBlue}
                  : {},
              ]}>
              Choose from a list of fast-paced exercises designed to get your
              heart and lungs going while breaking a good sweat
            </Text>
          )}
        />
        <Divider />
        <ListItem
          onPress={() => setSelectedCardioType(CardioType.SBIT)}
          accessoryLeft={() =>
            selectedCardioType === CardioType.SBIT ? (
              <Icon
                size={DevicePixels[8]}
                color={colors.appBlue}
                name="circle"
                solid
              />
            ) : (
              <View style={{width: DevicePixels[8]}} />
            )
          }
          title={props => (
            <Text
              {...props}
              style={[
                props.style,
                selectedCardioType === CardioType.SBIT
                  ? {color: colors.appBlue}
                  : {},
              ]}>
              Skill Based Interval Training
            </Text>
          )}
          description={props => (
            <Text
              {...props}
              style={[
                props.style,
                selectedCardioType === CardioType.SBIT
                  ? {color: colors.appBlue}
                  : {},
              ]}>
              These movements will get you using different pieces of equipment
              such as bosu balls and agility ladders to get you breathing
              heavily while improving your balance, coordination, speed and
              reaction time.
            </Text>
          )}
        />
        <Divider />
      </Collapsible>
    </View>
  );
};

export default GoalMenu;
