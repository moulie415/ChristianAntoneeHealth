import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import colors from '../../constants/colors';
import Text from './Text';

const MyTabs: React.FC<{
  tabs: string[];
  setTabIndex: (index: number) => void;
  tabIndex: number;
}> = ({tabs, setTabIndex, tabIndex}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        marginTop: 20,
      }}>
      {tabs.map((tab, index) => {
        return (
          <TouchableOpacity
            key={tab}
            style={{}}
            onPress={() => setTabIndex(index)}>
            <View
              style={{
                height: 40,
                width: 110,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor:
                  tabIndex === index ? colors.borderColor : 'transparent',
                borderTopLeftRadius: index === 0 ? 12 : 0,
                borderBottomLeftRadius: index === 0 ? 12 : 0,
                borderTopRightRadius: index === tabs.length - 1 ? 12 : 0,
                borderBottomRightRadius: index === tabs.length - 1 ? 12 : 0,
                borderWidth: 2,
                borderRightWidth: index === 0 ? 1 : 2,
                borderLeftWidth: index === tabs.length - 1 ? 1 : 2,
                borderColor: colors.borderColor,
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: tabIndex === index ? colors.appWhite : colors.button,
                  textAlign: 'center',
                }}>
                {tab}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default MyTabs;
