import {Divider, Layout, Text} from '@ui-kitten/components';
import React, {Fragment, useEffect, useState} from 'react';
import {
  View,
  ImageSourcePropType,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import {connect} from 'react-redux';
import {getQuickRoutines} from '../../actions/quickRoutines';
import globalStyles from '../../styles/globalStyles';
import {Area, Equipment, Focus} from '../../types/QuickRoutines';
import QuickRoutinesProps from '../../types/views/QuickRoutines';
import ImageLoader from '../commons/ImageLoader';

const sections: {
  title: string;
  key: 'area' | 'focus' | 'equipment';
  image: ImageSourcePropType;
  items: {id: Area | Focus | Equipment; name: string}[];
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
    image: require('../../images/flexibility.jpeg'),
  },
  {
    title: 'Training focus',
    key: 'focus',
    items: [
      {id: 'strength', name: 'Strength'},
      {id: 'mobility', name: 'Mobility'},
      {id: 'balance', name: 'Balance'},
      {id: 'intensity', name: 'High intensity'},
    ],
    image: require('../../images/lower_body.jpeg'),
  },
  {
    title: 'Equipment',
    key: 'equipment',
    items: [
      {id: 'full', name: 'Full equipment'},
      {id: 'minimal', name: 'Minimal equipment'},
      {id: 'none', name: 'No equipment'},
    ],
    image: require('../../images/dumbell.png'),
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
                onPress={() =>
                  setItemsCollapsed({
                    ...itemsCollapsed,
                    [index]: !itemsCollapsed[index],
                  })
                }
                key={title}
                style={{flex: 1, paddingBottom: 5}}>
                <ImageLoader
                  style={{width: '100%', flex: 1}}
                  delay={index * 200}
                  resizeMode="cover"
                  source={image}
                />
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    top: 0,
                    left: 20,
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
                        style={{padding: 20}}
                        key={id}
                        onPress={() => {
                          if (
                            id === 'upper' ||
                            id === 'strength' ||
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
                            id === 'mobility' ||
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
                            id === 'balance' ||
                            id === 'none'
                          ) {
                            // @ts-ignore
                            return navigation.navigate('QuickRoutinesTabs', {
                              screen: 'Tab3',
                              key,
                            });
                          }
                          if (id === 'core' || id === 'intensity') {
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
