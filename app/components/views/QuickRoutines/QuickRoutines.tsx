import {Divider, Layout, Text} from '@ui-kitten/components';
import React, {Fragment, useEffect, useState} from 'react';
import {
  View,
  ImageSourcePropType,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import {connect} from 'react-redux';
import {getQuickRoutines} from '../../../actions/quickRoutines';
import DevicePixels from '../../../helpers/DevicePixels';
import globalStyles from '../../../styles/globalStyles';
import {Area, Equipment} from '../../../types/QuickRoutines';
import {Goal} from '../../../types/Shared';
import QuickRoutinesProps from '../../../types/views/QuickRoutines';
import ImageLoader from '../../commons/ImageLoader';
import ImageOverlay from '../../commons/ImageOverlay';

const sections: {
  title: string;
  key: 'area' | 'focus' | 'equipment';
  image: ImageSourcePropType;
  items: {id: Area | Goal | Equipment; name: string}[];
}[] = [
  {
    title: 'Body part',
    key: 'area',
    items: [
      {id: 'upper', name: 'Upper body'},
      {id: 'lower', name: 'Lower body'},
      {id: 'full', name: 'Full body'},
      {id: 'core', name: 'Abs and core'},
    ],
    image: require('../../../images/Quick_Routine_body_part.jpeg'),
  },
  {
    title: 'Training focus',
    key: 'focus',
    items: [
      {
        id: Goal.STRENGTH,
        name: 'Strength',
      },
      {id: Goal.FITNESS, name: 'Fitness'},
    ],
    image: require('../../../images/Quick_routine_training_focus.jpeg'),
  },
  {
    title: 'Equipment',
    key: 'equipment',
    items: [
      {id: 'full', name: 'Full equipment'},
      {id: 'minimal', name: 'Minimal equipment'},
      {id: 'none', name: 'No equipment'},
    ],
    image: require('../../../images/Quick_routine_equipment.jpeg'),
  },
];

const QuickRoutines: React.FC<QuickRoutinesProps> = ({
  navigation,
  getQuickRoutinesAction,
}) => {
  const [itemsCollapsed, setItemsCollapsed] = useState<{
    [key: number]: boolean;
  }>(
    sections.reduce((acc, cur, index) => {
      return {...acc, [index]: true};
    }, {}),
  );

  useEffect(() => {
    getQuickRoutinesAction();
  }, [getQuickRoutinesAction]);
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
                    2: index === 2 ? !itemsCollapsed[2] : true,
                  });
                }}
                key={title}
                style={{flex: 1, marginBottom: DevicePixels[5]}}>
                {/* <ImageLoader
                  style={{width: '100%', flex: 1}}
                  delay={index * 200}
                  resizeMode="cover"
                  source={image}
                /> */}
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
                {items.map(({id, name}) => {
                  return (
                    <Fragment key={id}>
                      <TouchableOpacity
                        style={{padding: DevicePixels[20]}}
                        key={id}
                        onPress={() => {
                          if (
                            id === 'upper' ||
                            id === Goal.STRENGTH ||
                            (id === 'full' && key === 'equipment')
                          ) {
                            // @ts-ignore
                            return navigation.navigate('QuickRoutinesTabs', {
                              screen: 'Tab1',
                              key,
                            });
                          }
                          if (
                            id === 'lower' ||
                            id === Goal.FITNESS ||
                            id === 'minimal'
                          ) {
                            // @ts-ignore
                            return navigation.navigate('QuickRoutinesTabs', {
                              screen: 'Tab2',
                              key,
                            });
                          }
                          if (
                            (id === 'full' && key === 'area') ||
                            id === 'none'
                          ) {
                            // @ts-ignore
                            return navigation.navigate('QuickRoutinesTabs', {
                              screen: 'Tab3',
                              key,
                            });
                          }
                          if (id === 'core' && key === 'area') {
                            // @ts-ignore
                            return navigation.navigate('QuickRoutinesTabs', {
                              screen: 'Tab4',
                              key,
                            });
                          }
                        }}>
                        <Text>{name}</Text>
                      </TouchableOpacity>
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

const mapDispatchToProps = {
  getQuickRoutinesAction: getQuickRoutines,
};

export default connect(null, mapDispatchToProps)(QuickRoutines);
