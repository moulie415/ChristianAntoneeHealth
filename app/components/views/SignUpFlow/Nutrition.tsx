import _ from 'lodash';
import React, {useMemo, useState} from 'react';
import Collapsible from 'react-native-collapsible';
import {FlatList} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/FontAwesome6';
import colors from '../../../constants/colors';
import Divider from '../../commons/Divider';
import Input from '../../commons/Input';
import ListItem from '../../commons/ListItem';
import Text from '../../commons/Text';

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
    <KeyboardAwareScrollView
      enableOnAndroid
      contentContainerStyle={{
        flex: 1,
        justifyContent: 'center',
      }}>
      <Text
        style={{
          textAlign: 'center',
          marginVertical: 20,

          fontSize: 20,
          color: colors.appWhite,
        }}>
        Nutritional habits?
      </Text>
      <FlatList
        style={{
          backgroundColor: 'transparent',

          alignSelf: 'center',
        }}
        removeClippedSubviews={false}
        contentContainerStyle={{
          paddingBottom: 50,
          width: 250,
        }}
        scrollEnabled
        data={items}
        keyExtractor={item => (typeof item === 'string' ? item : item.key)}
        ItemSeparatorComponent={() => (
          <Divider style={{backgroundColor: colors.appGrey}} />
        )}
        renderItem={({item}) => {
          if (typeof item === 'string') {
            return (
              <ListItem
                accessoryLeft={
                  <Icon
                    name={nutrition.includes(item) ? 'check-square' : 'square'}
                    size={15}
                    solid={nutrition.includes(item)}
                    color={colors.appWhite}
                  />
                }
                style={{
                  backgroundColor: 'transparent',
                }}
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
                style={{
                  backgroundColor: 'transparent',
                }}
                title={item.key}
                accessoryRight={
                  <Icon
                    name={open[item.key] ? 'chevron-down' : 'chevron-right'}
                    size={15}
                    color={colors.appWhite}
                    style={{marginRight: 10}}
                  />
                }
                onPress={() => setOpen({...open, [item.key]: !open[item.key]})}
              />
              <Collapsible collapsed={!open[item.key]}>
                {item.key === 'Supplements' ? (
                  <Input
                    placeholder="List supplements here..."
                    multiline
                    style={{
                      height: 100,
                      textAlignVertical: 'top',
                    }}
                    onChangeText={text => {
                      setSupplements(text);
                      updateSupplements(text);
                    }}
                    defaultValue={supplements}
                  />
                ) : (
                  item.items?.map(i => {
                    const option = `${item.key}: ${i}`;
                    return (
                      <ListItem
                        accessoryLeft={
                          <Icon
                            name={
                              nutrition.includes(option)
                                ? 'check-square'
                                : 'square'
                            }
                            size={15}
                            solid={nutrition.includes(option)}
                            color={colors.appWhite}
                            style={{marginRight: 10}}
                          />
                        }
                        style={{
                          backgroundColor: 'transparent',
                          marginLeft: 10,
                        }}
                        title={i}
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
    </KeyboardAwareScrollView>
  );
};

export default Nutrition;
