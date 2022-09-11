import {View} from 'react-native';
import React from 'react';
import Text from '../../commons/Text';
import DevicePixels from '../../../helpers/DevicePixels';
import Color from 'color';
import colors from '../../../constants/colors';

const items: {
  value: string;
  title: string;
  description: string;
  color: string;
  textColor: string;
}[] = [
  {
    value: '10',
    title: 'Max Effort Activity',
    description:
      'Feels almost impossible to keep going. Completely out of breath, unable to talk. Cannot maintain for more than a very short time.',
    color: colors.appBlue,
    textColor: colors.appWhite,
  },
  {
    value: '9',
    title: 'Very Hard Activity',
    description:
      'Very difficult to maintain exercise intensity. Can barely breath and speak only a few words',
    color: Color(colors.appBlue).lighten(0.2).string(),
    textColor: colors.appWhite,
  },
  {
    value: '7-8',
    title: 'Vigorous Activity',
    description:
      'Borderline uncomfortable. Short of breath, can speak a sentence.',
    color: Color(colors.appBlue).lighten(0.4).string(),
    textColor: colors.appWhite,
  },
  {
    value: '4-6',
    title: 'Moderate Activity',
    description:
      'Breathing heavily, can hold short conversation. Still somewhat comfortable, but becoming noticeably more challenging.',
    color: Color(colors.appBlue).lighten(0.6).string(),
    textColor: colors.appBlack,
  },
  {
    value: '2-3',
    title: 'Light Activity',
    description:
      'Feels like you can maintain for hours. Easy to breathe and carry a conversation',
    color: Color(colors.appBlue).lighten(0.8).string(),
    textColor: colors.appBlack,
  },
  {
    value: '1',
    title: 'Very light Activity',
    description:
      'Hardly any exertion, but more than sleeping, watching TV, etc',
    color: Color(colors.appBlue).lighten(1).string(),
    textColor: colors.appBlack,
  },
];

const ResistanceScaleInfo = () => {
  return (
    <View style={{width: DevicePixels[300]}}>
      {items.map(item => {
        return (
          <View
            key={item.value}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: item.color,
              padding: DevicePixels[5],
              paddingVertical: DevicePixels[10],
            }}>
            <Text
              style={{
                width: DevicePixels[30],
                textAlign: 'center',
                color: item.textColor,
                fontWeight: 'bold',
              }}>
              {item.value}
            </Text>
            <View style={{flex: 1}}>
              <Text style={{color: item.textColor, fontWeight: 'bold'}}>
                {item.title}
              </Text>
              <Text style={{color: item.textColor, fontSize: DevicePixels[10]}}>
                {item.description}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default ResistanceScaleInfo;
