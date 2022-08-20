import React, {useState} from 'react';
import SavedWorkouts from './components/views/SavedItems/SavedWorkouts';
import SavedTests from './components/views/SavedItems/SavedTests';
import {TouchableOpacity, useWindowDimensions} from 'react-native';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from './App';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from './components/commons/Header';
import LinearGradient from 'react-native-linear-gradient';
import colors from './constants/colors';
import DevicePixels from './helpers/DevicePixels';
import Text from './components/commons/Text';
import FastImage from 'react-native-fast-image';

const SavedItemsTabs: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'SavedItems'>;
}> = ({navigation}) => {
  const layout = useWindowDimensions();

  const renderScene = SceneMap({
    savedWorkouts: () => <SavedWorkouts navigation={navigation} />,
    savedTests: () => <SavedTests navigation={navigation} />,
  });

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'savedWorkouts', title: 'Saved workouts'},
    {key: 'savedTests', title: 'Saved tests'},
  ]);
  return (
    <FastImage
      source={require('./images/old-black-background-grunge.png')}
      style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <Header hasBack />
        <TabView
          renderTabBar={props => {
            return (
              // <ScrollView horizontal style={{flexGrow: 0}}>
              <TabBar
                {...props}
                renderTabBarItem={props => {
                  return (
                    <TouchableOpacity key={props.key} onPress={props.onPress}>
                      <LinearGradient
                        colors={
                          props.key === routes[index].key
                            ? [colors.appBlueLight, colors.appBlueDark]
                            : ['transparent', 'transparent']
                        }
                        style={{
                          height: DevicePixels[45],
                          paddingHorizontal: DevicePixels[20],
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: DevicePixels[25],
                        }}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            color: '#fff',
                            textAlign: 'center',
                          }}>
                          {props.route?.title}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  );
                }}
                labelStyle={{textTransform: 'none', color: colors.appBlack}}
                style={{
                  backgroundColor: 'transparent',
                }}
                contentContainerStyle={{
                  marginBottom: DevicePixels[20],
                  justifyContent: 'space-evenly',
                }}
                indicatorStyle={{backgroundColor: 'transparent'}}
              />
              // </ScrollView>
            );
          }}
          lazy
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: layout.width}}
        />
      </SafeAreaView>
    </FastImage>
  );
};

export default SavedItemsTabs;
