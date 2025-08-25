import React, { ReactNode } from 'react';
import { TouchableOpacity, View } from 'react-native';
import colors from '../../constants/colors';

const IconTabs: React.FC<{
  icons: { icon: ReactNode; key: string }[];
  setTabIndex: (index: number) => void;
  tabIndex: number;
}> = ({ icons, setTabIndex, tabIndex }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {icons.map(({ icon, key }, index) => {
        return (
          <TouchableOpacity
            key={key}
            style={{}}
            onPress={() => setTabIndex(index)}
          >
            <View
              style={{
                height: 30,
                width: 40,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor:
                  tabIndex === index ? colors.appBlue : 'transparent',
                borderTopLeftRadius: index === 0 ? 12 : 0,
                borderBottomLeftRadius: index === 0 ? 12 : 0,
                borderTopRightRadius: index === icons.length - 1 ? 12 : 0,
                borderBottomRightRadius: index === icons.length - 1 ? 12 : 0,
                borderWidth: 2,
                borderRightWidth: index === 0 ? 1 : 2,
                borderLeftWidth: index === icons.length - 1 ? 1 : 2,
                borderColor: colors.appBlue,
              }}
            >
              {icon}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default IconTabs;
