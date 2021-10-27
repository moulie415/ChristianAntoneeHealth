import {Divider, ListItem, Text} from '@ui-kitten/components';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {View} from 'react-native';
import {Level} from '../../../types/Shared';
import DevicePixels from '../../../helpers/DevicePixels';
import colors from '../../../constants/colors';

const ExperienceMenu: React.FC<{
  selectedLevel: Level;
  setSelectedLevel: (level: Level) => void;
}> = ({selectedLevel, setSelectedLevel}) => {
  return (
    <View>
      <ListItem
        onPress={() => setSelectedLevel(Level.BEGINNER)}
        accessoryLeft={() =>
          selectedLevel === Level.BEGINNER ? (
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
              selectedLevel === Level.BEGINNER ? {color: colors.appBlue} : {},
            ]}>
            Beginner
          </Text>
        )}
        description={props => (
          <Text
            {...props}
            style={[
              props.style,
              selectedLevel === Level.BEGINNER ? {color: colors.appBlue} : {},
            ]}>
            If you’re just starting out on your health and fitness journey or
            working through an injury and want to make sure you’re technique is
            right then this is a good place to start
          </Text>
        )}
      />
      <Divider />
      <ListItem
        onPress={() => setSelectedLevel(Level.INTERMEDIATE)}
        accessoryLeft={() =>
          selectedLevel === Level.INTERMEDIATE ? (
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
              selectedLevel === Level.INTERMEDIATE
                ? {color: colors.appBlue}
                : {},
            ]}>
            Intermediate
          </Text>
        )}
        description={props => (
          <Text
            {...props}
            style={[
              props.style,
              selectedLevel === Level.INTERMEDIATE
                ? {color: colors.appBlue}
                : {},
            ]}>
            For those of you who have been recreationally active for a while and
            have some experience in the gym with weights, but would like a
            little more direction and guidance in structuring your workouts.
          </Text>
        )}
      />
      <Divider />
      <ListItem
        onPress={() => setSelectedLevel(Level.ADVANCED)}
        accessoryLeft={() =>
          selectedLevel === Level.ADVANCED ? (
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
              selectedLevel === Level.ADVANCED ? {color: colors.appBlue} : {},
            ]}>
            Advanced
          </Text>
        )}
        description={props => (
          <Text
            {...props}
            style={[
              props.style,
              selectedLevel === Level.ADVANCED ? {color: colors.appBlue} : {},
            ]}>
            If you’re a seasoned veteran and want a challenge, then here you’ll
            find a list of exercises that will require you to move in multiple
            planes, transfer power efficiently up and down the body, and use
            your joints and muscles in creative ways.
          </Text>
        )}
      />
      <Divider />
    </View>
  );
};

export default ExperienceMenu;
