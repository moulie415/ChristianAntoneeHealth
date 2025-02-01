import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {TouchableOpacity, useWindowDimensions, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import {StackParamList} from './App';
import Header from './components/commons/Header';
import Text from './components/commons/Text';
import Exercise from './components/views/Education/Exercise';
import General from './components/views/Education/General';
import Nutritional from './components/views/Education/Nutritional';
import colors from './constants/colors';

const EducationTabs: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'Education'>;
}> = ({navigation}) => {
  const layout = useWindowDimensions();

  const renderScene = SceneMap({
    general: () => <General navigation={navigation} />,
    exercise: () => <Exercise navigation={navigation} />,
    nutritional: () => <Nutritional navigation={navigation} />,
  });

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'general', title: 'General Lifestyle'},
    {key: 'exercise', title: 'Exercise Articles'},
    {key: 'nutritional', title: 'Nutritional Info'},
  ]);
  return (
    <View style={{flex: 1, backgroundColor: colors.appGrey}}>
      <SafeAreaView style={{flex: 1}}>
        <Header hasBack title="Education" />
        <TabView
          renderTabBar={props => {
            return (
              <ScrollView horizontal style={{flexGrow: 0}}>
                <TabBar
                  {...props}
                  renderTabBarItem={props => {
                    return (
                      <TouchableOpacity key={props.key} onPress={props.onPress}>
                        <View
                          style={{
                            height: 45,
                            paddingHorizontal: 20,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 12,
                            backgroundColor:
                              props.key === routes[index].key
                                ? colors.appBlue
                                : 'transparent',
                            borderWidth:
                              props.key === routes[index].key ? 0 : 1,
                            borderColor: colors.borderColor,
                            marginHorizontal: 5,
                          }}>
                          <Text
                            style={{
                              fontWeight: 'bold',
                              color: '#fff',
                              textAlign: 'center',
                            }}>
                            {props.route?.title}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                  // labelStyle={{textTransform: 'none', color: colors.appBlack}}
                  style={{
                    backgroundColor: 'transparent',
                  }}
                  contentContainerStyle={{marginBottom: 20}}
                  indicatorStyle={{backgroundColor: 'transparent'}}
                />
              </ScrollView>
            );
          }}
          lazy
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: layout.width}}
        />
      </SafeAreaView>
    </View>
  );
};

export default EducationTabs;
