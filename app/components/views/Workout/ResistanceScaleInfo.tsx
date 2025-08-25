import React from 'react';
import { View } from 'react-native';
import Text from '../../commons/Text';

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
    color: Color(colors.appBlue).lighten(0.3).hex(),
    textColor: colors.appWhite,
  },
  {
    value: '7-8',
    title: 'Vigorous Activity',
    description:
      'Borderline uncomfortable. Short of breath, can speak a sentence.',
    color: Color(colors.appBlue).lighten(0.4).hex(),
    textColor: Color(colors.appWhite).darken(0.1).hex(),
  },
  {
    value: '4-6',
    title: 'Moderate Activity',
    description:
      'Breathing heavily, can hold short conversation. Still somewhat comfortable, but becoming noticeably more challenging.',
    color: Color(colors.appBlue).lighten(0.6).hex(),
    textColor: Color(colors.appWhite).darken(0.6).hex(),
  },
  {
    value: '2-3',
    title: 'Light Activity',
    description:
      'Feels like you can maintain for hours. Easy to breathe and carry a conversation',
    color: Color(colors.appBlue).lighten(0.7).hex(),
    textColor: Color(colors.tile).lighten(0.6).hex(),
  },
  {
    value: '1',
    title: 'Very light Activity',
    description:
      'Hardly any exertion, but more than sleeping, watching TV, etc',
    color: Color(colors.appBlue).lighten(0.9).hex(),
    textColor: Color(colors.tile).lighten(0.5).hex(),
  },
];

const ResistanceScaleInfo = () => {
  return (
    <View style={{ margin: 20 }}>
      {items.map((item, index) => {
        return (
          <View
            key={item.value}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: item.color,
              padding: 5,
              paddingVertical: 8,
              borderTopLeftRadius: index === 0 ? 12 : 0,
              borderTopRightRadius: index === 0 ? 12 : 0,
              borderBottomLeftRadius: index === items.length - 1 ? 12 : 0,
              borderBottomRightRadius: index === items.length - 1 ? 12 : 0,
            }}
          >
            <Text
              style={{
                width: 30,
                textAlign: 'center',
                color: item.textColor,
                fontWeight: 'bold',
              }}
            >
              {item.value}
            </Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: item.textColor, fontWeight: 'bold' }}>
                {item.title}
              </Text>
              <Text style={{ color: item.textColor, fontSize: 10 }}>
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
