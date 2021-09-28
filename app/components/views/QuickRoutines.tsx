import {Divider, Layout, Text} from '@ui-kitten/components';
import React, {useState} from 'react';
import {
  View,
  ImageSourcePropType,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import globalStyles from '../../styles/globalStyles';
import ImageLoader from '../commons/ImageLoader';

const sections: {
  title: string;
  image: ImageSourcePropType;
  items: string[];
}[] = [
  {
    title: 'Body part',
    items: ['Upper body', 'Lower body', 'Abs and core', 'Full body'],
    image: require('../../images/flexibility.jpeg'),
  },
  {
    title: 'Training focus',
    items: ['strength', 'mobility', 'balance', 'high intensity'],
    image: require('../../images/lower_body.jpeg'),
  },
  {
    title: 'Equipment',
    items: ['full equipment', 'minimal equipment', 'no equipment'],
    image: require('../../images/dumbell.png'),
  },
];

const QuickRoutines: React.FC = ({navigation}) => {
  const [itemsCollapsed, setItemsCollapsed] = useState<{
    [key: number]: boolean;
  }>(
    sections.reduce((acc, cur, index) => {
      return {...acc, [index]: true};
    }, {}),
  );
  return (
    <SafeAreaView style={{flex: 1}}>
      <Layout style={{flex: 1}}>
        {sections.map(({title, image, items}, index) => {
          return (
            <>
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
                {items.map(item => {
                  return (
                    <>
                      <TouchableOpacity
                        style={{padding: 20}}
                        key={item}
                        onPress={() => 0}>
                        <Text>{item}</Text>
                      </TouchableOpacity>
                      <Divider />
                    </>
                  );
                })}
              </Collapsible>
            </>
          );
        })}
      </Layout>
    </SafeAreaView>
  );
};

export default QuickRoutines;
