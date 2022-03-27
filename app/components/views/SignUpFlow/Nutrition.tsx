import {View} from 'react-native';
import React, {useState} from 'react';
import Text from '../../commons/Text';
import DevicePixels from '../../../helpers/DevicePixels';
import colors from '../../../constants/colors';
import {List, ListItem} from '@ui-kitten/components';
import Collapsible from 'react-native-collapsible';

const Nutrition: React.FC<{
  nutrition: string[];
  setNutrition: (info: string[]) => void;
}> = ({nutrition, setNutrition}) => {
  const [open, setOpen] = useState<{[key: string]: boolean}>({});
  const items: (string | {key: string; items?: string[]})[] = [
    'I eat everything',
    "I'm vegetarian",
    "I'm vegan",
    "I'm pescatarian",
    'I follow a ketogenic diet',
    'I skip breakfast',
    'I eat late at night',
    {key: 'I like to fast', items: ['regularly', 'sporadic']},
    {key: 'Alcohol consumption', items: ['low', 'moderate', 'high']},
    {key: 'Portion size', items: ['small', 'medium', 'large']},
    {key: 'I like to order in', items: ['regularly', 'sporadic']},
    {key: 'Water consumption', items: ['low', 'moderate', 'high']},
    {key: 'Caffeine consumption', items: ['low', 'moderate', 'high']},
    'I prefer gluten free foods',
    'I prefer dairy free foods',
  ];
  return (
    <View>
      <Text
        category="h4"
        style={{
          textAlign: 'center',
          marginVertical: DevicePixels[20],
          width: DevicePixels[250],
          color: colors.appWhite,
        }}>
        Nutritional habits?
      </Text>
      <List
        style={{backgroundColor: 'transparent'}}
        //contentContainerStyle={{backgroundColor: 'transparent'}}
        data={items}
        keyExtractor={item => (typeof item === 'string' ? item : item.key)}
        renderItem={({item}) => {
          if (typeof item === 'string') {
            return (
              <ListItem
                style={{backgroundColor: 'transparent'}}
                title={item}
                onPress={() =>
                  nutrition.includes(item)
                    ? setNutrition(nutrition.filter(i => i !== item))
                    : setNutrition([...nutrition, item])
                }
              />
            );
          }
          return (
            <>
              <ListItem
                title={item.key}
                onPress={() => setOpen({...open, [item.key]: !open[item.key]})}
              />
              <Collapsible collapsed={!open[item.key]}>
                {item.items.map(i => {
                  return (
                    <ListItem
                      title={i}
                      key={i}
                      onPress={() =>
                        setNutrition([
                          ...nutrition.filter(i => i.includes(item.key)),
                          `${item.key} ${i}`,
                        ])
                      }
                    />
                  );
                })}
              </Collapsible>
            </>
          );
        }}
      />
    </View>
  );
};

export default Nutrition;
