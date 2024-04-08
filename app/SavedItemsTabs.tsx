import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {TouchableOpacity, View, useWindowDimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SceneMap, TabBar, TabView} from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {connect} from 'react-redux';
import {StackParamList} from './App';
import Header from './components/commons/Header';
import Text from './components/commons/Text';
import SavedRecipes from './components/views/SavedItems/SavedRecipes';
import SavedTests from './components/views/SavedItems/SavedTests';
import SavedWorkouts from './components/views/SavedItems/SavedWorkouts';
import colors from './constants/colors';
import {getSavedWorkouts} from './reducers/exercises';
import {getSavedQuickRoutines} from './reducers/quickRoutines';
import {getSavedRecipes} from './reducers/recipes';
import {getSavedTests} from './reducers/tests';
import {Profile} from './types/Shared';
import {MyRootState} from './types/Shared';

const SavedItemsTabs: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'SavedItems'>;
  profile: Profile;
  getSavedWorkouts: () => void;
  getSavedTests: () => void;
  getSavedQuickRoutines: () => void;
  getSavedRecipes: () => void;
}> = ({
  navigation,
  profile,
  getSavedQuickRoutines: getSavedQuickRoutinesAction,
  getSavedRecipes: getSavedRecipesAction,
  getSavedTests: getSavedTestsAction,
  getSavedWorkouts: getSavedWorkoutsAction,
}) => {
  const layout = useWindowDimensions();

  const renderScene = SceneMap({
    savedWorkouts: () => <SavedWorkouts navigation={navigation} />,
    savedTests: () => <SavedTests navigation={navigation} />,
    savedRecipes: () => <SavedRecipes navigation={navigation} />,
  });

  const [index, setIndex] = useState(profile.premium ? 0 : 2);
  const [routes] = useState([
    {key: 'savedWorkouts', title: 'Workouts'},
    {key: 'savedTests', title: 'Tests'},
    {key: 'savedRecipes', title: 'Recipes'},
  ]);

  useEffect(() => {
    getSavedQuickRoutinesAction();
    getSavedWorkoutsAction();
    getSavedRecipesAction();
    getSavedTestsAction();
  }, [
    getSavedQuickRoutinesAction,
    getSavedWorkoutsAction,
    getSavedRecipesAction,
    getSavedTestsAction,
  ]);
  return (
    <View style={{flex: 1, backgroundColor: colors.appGrey}}>
      <SafeAreaView style={{flex: 1}}>
        <Header hasBack title="Saved" />
        <TabView
          renderTabBar={p => {
            return (
              // <ScrollView horizontal style={{flexGrow: 0}}>
              <TabBar
                {...p}
                renderTabBarItem={props => {
                  const needsPremium =
                    (props.key === 'savedWorkouts' ||
                      props.key === 'savedTests') &&
                    !profile.premium;
                  return (
                    <TouchableOpacity
                      key={props.key}
                      onPress={
                        needsPremium
                          ? () => navigation.navigate('Premium', {})
                          : props.onPress
                      }>
                      <View
                        style={{
                          height: 45,
                          minWidth: 110,
                          paddingHorizontal: 10,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 12,
                          backgroundColor:
                            props.key === routes[index].key
                              ? colors.appBlue
                              : 'transparent',
                          borderWidth: props.key === routes[index].key ? 0 : 1,
                          borderColor: colors.borderColor,
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            color: '#fff',
                            textAlign: 'center',
                          }}>
                          {props.route?.title}
                        </Text>
                        {needsPremium && (
                          <Icon
                            style={{marginLeft: 5}}
                            name="lock"
                            color={colors.appWhite}
                          />
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                }}
                labelStyle={{textTransform: 'none', color: colors.appBlack}}
                style={{
                  backgroundColor: 'transparent',
                }}
                contentContainerStyle={{
                  marginBottom: 20,
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
    </View>
  );
};

const mapStateToProps = ({profile, exercises, recipes}: MyRootState) => ({
  profile: profile.profile,
  loading: exercises.loading || recipes.loading,
});

const mapDispatchToProps = {
  getSavedQuickRoutines,
  getSavedRecipes,
  getSavedTests,
  getSavedWorkouts,
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedItemsTabs);
