import React, {useMemo} from 'react';
import {View} from 'react-native';
import colors from '../../constants/colors';
import DevicePixels from '../../helpers/DevicePixels';
// @ts-ignore
import Body from 'react-native-body-highlighter';
import Text from './Text';
import {Layout} from '@ui-kitten/components';
import Exercise from '../../types/Exercise';
import {
  mapMuscleToHighlight,
  muscleReadableString,
} from '../../helpers/exercises';

const MusclesDiagram: React.FC<{exercise: Exercise}> = ({exercise}) => {
  const muscles = useMemo(() => {
    const arr = [];
    if (exercise.muscles) {
      arr.push(
        ...mapMuscleToHighlight(exercise.muscles).map(m => {
          return {slug: m, intensity: 1};
        }),
      );
    }
    if (exercise.musclesSecondary) {
      arr.push(
        ...mapMuscleToHighlight(exercise.musclesSecondary).map(m => {
          return {slug: m, intensity: 2};
        }),
      );
    }
    return arr;
  }, [exercise.muscles, exercise.musclesSecondary]);
  return (
    <Layout
      style={{
        borderRadius: 10,
        backgroundColor: '#fff',
        height: DevicePixels[300],
        padding: DevicePixels[10],
      }}>
      <Text category="h5">Muscles worked</Text>
      <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        <View style={{marginRight: DevicePixels[10]}}>
          <Text>Primary:</Text>
          <View style={{flexDirection: 'row'}}>
            {exercise.muscles.map(muscle => (
              <View
                key={muscle}
                style={{
                  backgroundColor: colors.appBlue,
                  padding: 2,
                  paddingHorizontal: 5,
                  borderRadius: 10,
                  marginTop: 2,
                  marginRight: 5,
                }}>
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 10,
                    textAlign: 'center',
                  }}>
                  {muscleReadableString(muscle).toUpperCase()}
                </Text>
              </View>
            ))}
          </View>
        </View>
        {exercise.musclesSecondary && (
          <View>
            <Text>Secondary: </Text>
            <View style={{flexDirection: 'row'}}>
              {exercise.musclesSecondary.map(muscle => (
                <View
                  key={muscle}
                  style={{
                    backgroundColor: colors.appLightBlue,
                    padding: 2,
                    paddingHorizontal: 5,
                    borderRadius: 10,
                    marginTop: 2,
                    marginRight: 5,
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontSize: 10,
                      textAlign: 'center',
                    }}>
                    {muscleReadableString(muscle).toUpperCase()}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
      <Layout
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: DevicePixels[20],
        }}>
        <Body
          scale={1}
          data={muscles}
          colors={[colors.appBlue, colors.appLightBlue]}
        />
      </Layout>
    </Layout>
  );
};

export default MusclesDiagram;
