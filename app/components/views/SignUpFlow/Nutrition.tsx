import {View} from 'react-native';
import React, {useCallback, useMemo, useState} from 'react';
import Text from '../../commons/Text';
import DevicePixels from '../../../helpers/DevicePixels';
import colors from '../../../constants/colors';
import {Divider, Input, List, ListItem} from '@ui-kitten/components';
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/FontAwesome5';
import _ from 'lodash';

const Nutrition: React.FC<{
  nutrition: string[];
  setNutrition: (info: string[]) => void;
}> = ({nutrition, setNutrition}) => {
  const [open, setOpen] = useState<{[key: string]: boolean}>({});
  const [supplements, setSupplements] = useState('');
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
    {key: 'Supplements', items: []},
    'I prefer gluten free foods',
    'I prefer dairy free foods',
  ];

  const updateSupplements = useMemo(
    () =>
      _.debounce(text => {
        setNutrition([
          ...nutrition.filter(i => !i.includes('Supplements:')),
          `Supplements: ${text}`,
        ]);
      }, 1000),
    [nutrition, setNutrition],
  );

  return (
    <View style={{flex: 1}}>
      <Text
        category="h4"
        style={{
          textAlign: 'center',
          margin: DevicePixels[20],
          marginBottom: 0,
          width: DevicePixels[250],
          color: colors.appWhite,
        }}>
        Nutritional habits?
      </Text>
      <List
        style={{
          backgroundColor: 'transparent',
          width: DevicePixels[190],
          alignSelf: 'center',
        }}
        contentContainerStyle={{
          paddingBottom: DevicePixels[50],
        }}
        data={items}
        keyExtractor={item => (typeof item === 'string' ? item : item.key)}
        ItemSeparatorComponent={() => (
          <Divider style={{backgroundColor: colors.appGrey}} />
        )}
        renderItem={({item}) => {
          if (typeof item === 'string') {
            return (
              <ListItem
                accessoryLeft={() => (
                  <Icon
                    name={nutrition.includes(item) ? 'check-square' : 'square'}
                    size={DevicePixels[15]}
                    solid={nutrition.includes(item)}
                    color={colors.appWhite}
                    style={{marginRight: DevicePixels[10]}}
                  />
                )}
                style={{
                  backgroundColor: 'transparent',
                }}
                title={() => (
                  <Text style={{color: colors.appWhite}}>{item}</Text>
                )}
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
                style={{
                  backgroundColor: 'transparent',
                }}
                title={() => (
                  <Text style={{color: colors.appWhite}}>{item.key}</Text>
                )}
                accessoryRight={() => (
                  <Icon
                    name={open[item.key] ? 'chevron-down' : 'chevron-right'}
                    size={DevicePixels[15]}
                    color={colors.appWhite}
                    style={{marginRight: DevicePixels[10]}}
                  />
                )}
                onPress={() => setOpen({...open, [item.key]: !open[item.key]})}
              />
              <Collapsible collapsed={!open[item.key]}>
                {item.key === 'Supplements' ? (
                  <Input
                    placeholder="List supplements here..."
                    multiline
                    textStyle={{
                      height: DevicePixels[50],
                      textAlignVertical: 'top',
                    }}
                    onChangeText={text => {
                      setSupplements(text);
                      updateSupplements(text);
                    }}
                    value={supplements}
                  />
                ) : (
                  item.items.map(i => {
                    const option = `${item.key}: ${i}`;
                    return (
                      <ListItem
                        accessoryLeft={() => (
                          <Icon
                            name={
                              nutrition.includes(option)
                                ? 'check-square'
                                : 'square'
                            }
                            size={DevicePixels[15]}
                            solid={nutrition.includes(option)}
                            color={colors.appWhite}
                            style={{marginRight: DevicePixels[10]}}
                          />
                        )}
                        style={{
                          backgroundColor: 'transparent',
                          marginLeft: DevicePixels[10],
                        }}
                        title={() => (
                          <Text style={{color: colors.appWhite}}>{i}</Text>
                        )}
                        key={i}
                        onPress={() => {
                          setNutrition([
                            ...nutrition.filter(opt => !opt.includes(item.key)),
                            ...(nutrition.includes(option) ? [] : [option]),
                          ]);
                        }}
                      />
                    );
                  })
                )}
              </Collapsible>
            </>
          );
        }}
      />
    </View>
  );
};

export default Nutrition;
