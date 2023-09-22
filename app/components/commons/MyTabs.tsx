import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import colors from '../../constants/colors';

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
                borderRadius: 12,
                borderTopRightRadius: index === 0 ? 0 : 12,
                borderBottomRightRadius: index === 0 ? 0 : 12,
                borderTopLeftRadius: index === tabs.length - 1 ? 0 : 12,
                borderBottomLeftRadius: index === tabs.length - 1 ? 0 : 12,
                borderWidth: 2,
                borderColor:
                  tabIndex === index ? colors.borderColor : colors.borderColor,
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
