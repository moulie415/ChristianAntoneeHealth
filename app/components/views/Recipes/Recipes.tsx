import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {Dimensions} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {StackParamList} from '../../../App';
import colors from '../../../constants/colors';
import {getRecipes} from '../../../reducers/recipes';
import Profile from '../../../types/Profile';
import {MyRootState, Recipe} from '../../../types/Shared';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import Header from '../../commons/Header';
import RecipeCard from './RecipeCard';
import {recipeCategories} from './RecipeCategories';

const {height} = Dimensions.get('screen');

const Recipes: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'Recipes'>;
  route: RouteProp<StackParamList, 'Recipes'>;
  recipes: {[key: string]: Recipe};
  getRecipes: () => void;
  loading: boolean;
  profile: Profile;
}> = ({recipes, getRecipes: getRecipesAction, route, navigation, profile}) => {
  useEffect(() => {
    getRecipesAction();
  }, [getRecipesAction]);
  const {category} = route.params;

  const filtered = Object.values(recipes).filter(
    recipe => recipe.category === category,
  );
  return (
    <SafeAreaView style={{backgroundColor: colors.appGrey, flex: 1}}>
      <Header
        hasBack
        title={recipeCategories.find(c => c.category === category)?.name}
      />
      <FlatList
        data={filtered}
        ListEmptyComponent={() => (
          <SafeAreaView style={{height: height / 2}}>
            <AbsoluteSpinner
              loading
              style={{backgroundColor: colors.appGrey}}
            />
          </SafeAreaView>
        )}
        renderItem={({item}) => {
          return (
            <RecipeCard
              name={item.name}
              image={item.image.src}
              onPress={() => {
                if (item.premium && !profile.premium) {
                  navigation.navigate('Premium', {});
                } else {
                  navigation.navigate('Recipe', {recipe: item});
                }
              }}
            />
          );
        }}
      />
    </SafeAreaView>
  );
};

const mapStateToProps = ({recipes, profile}: MyRootState) => ({
  recipes: recipes.recipes,
  loading: recipes.loading,
  profile: profile.profile,
});

const mapDispatchToProps = {
  getRecipes,
};

export default connect(mapStateToProps, mapDispatchToProps)(Recipes);
