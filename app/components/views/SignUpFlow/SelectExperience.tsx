import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Level} from '../../../types/Shared';
import Text from '../../commons/Text';
import DevicePixels from '../../../helpers/DevicePixels';
import colors from '../../../constants/colors';

const SelectExperience: React.FC<{
  experience: Level;
  setExperience: (experience: Level) => void;
}> = ({experience, setExperience}) => {
  return (
    <View>
      <Text
        category="h4"
        style={{
          textAlign: 'center',
          marginVertical: DevicePixels[20],
          width: DevicePixels[250],
          color: colors.appBlue,
        }}>
        What's your experience level?
      </Text>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          paddingBottom: DevicePixels[175],
        }}>
        <TouchableOpacity
          onPress={() => setExperience(Level.BEGINNER)}
          style={{
            marginBottom: DevicePixels[20],
            backgroundColor:
              experience === Level.BEGINNER ? colors.appBlue : colors.appWhite,
            padding: DevicePixels[10],
            borderColor: colors.appBlue,
            borderWidth: DevicePixels[1],
            borderRadius: DevicePixels[5],
          }}>
          <Text
            style={{
              textAlign: 'center',
              color:
                experience === Level.BEGINNER
                  ? colors.appWhite
                  : colors.appBlue,
            }}>
            No clue what I’m doing
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setExperience(Level.INTERMEDIATE)}
          style={{
            marginBottom: DevicePixels[20],
            backgroundColor:
              experience === Level.INTERMEDIATE
                ? colors.appBlue
                : colors.appWhite,
            padding: DevicePixels[10],
            borderColor: colors.appBlue,
            borderWidth: DevicePixels[1],
            borderRadius: DevicePixels[5],
          }}>
          <Text
            style={{
              textAlign: 'center',
              color:
                experience === Level.INTERMEDIATE
                  ? colors.appWhite
                  : colors.appBlue,
            }}>
            I workout every now and again
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setExperience(Level.ADVANCED)}
          style={{
            backgroundColor:
              experience === Level.ADVANCED ? colors.appBlue : colors.appWhite,
            padding: DevicePixels[10],
            borderColor: colors.appBlue,
            borderWidth: DevicePixels[1],
            borderRadius: DevicePixels[5],
          }}>
          <Text
            style={{
              textAlign: 'center',
              color:
                experience === Level.ADVANCED
                  ? colors.appWhite
                  : colors.appBlue,
            }}>
            I’m a seasoned veteran
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SelectExperience;
