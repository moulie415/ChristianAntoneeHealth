import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {FunctionComponent, useMemo} from 'react';
import {Dimensions, FlatList, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {connect} from 'react-redux';
import {StackParamList} from '../../../App';
import colors from '../../../constants/colors';
import Profile from '../../../types/Profile';
import {MyRootState, Recipe} from '../../../types/Shared';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import Text from '../../commons/Text';
import RecipeCard from '../Recipes/RecipeCard';

const {height} = Dimensions.get('screen');

type SavedItemsNavigationProp = NativeStackNavigationProp<
  StackParamList,
  'SavedItems'
>;

const SavedRecipes: FunctionComponent<{
  loading: boolean;
  navigation: SavedItemsNavigationProp;
  profile: Profile;
  getSavedRecipes: () => void;
  recipes: {[key: string]: Recipe};
}> = ({loading, navigation, profile, recipes}) => {
  const missing = useMemo(
    () => profile.favouriteRecipes?.filter(recipe => !recipes[recipe]) || [],
    [profile.favouriteRecipes, recipes],
  );

  const saved: Recipe[] =
    missing.length || !profile.favouriteRecipes
      ? []
      : profile.favouriteRecipes.map(r => recipes[r]);

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={saved}
        ListEmptyComponent={
          <SafeAreaView style={{height: height / 2}}>
            {loading ? (
              <AbsoluteSpinner
                loading
                style={{backgroundColor: colors.appGrey}}
              />
            ) : (
              <>
                <Text
                  style={{
                    textAlign: 'center',
                    color: colors.appWhite,
                    fontSize: 16,
                  }}>
                  No saved recipes found
                </Text>
                <Icon
                  name="utensils"
                  color={colors.appWhite}
                  size={30}
                  style={{textAlign: 'center', marginTop: 15}}
                />
              </>
            )}
          </SafeAreaView>
        }
        keyExtractor={item => item.id || ''}
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
    </View>
  );
};

const mapStateToProps = ({recipes, profile}: MyRootState) => ({
  loading: recipes.loading,
  recipes: recipes.recipes,
  profile: profile.profile,
});

export default connect(mapStateToProps)(SavedRecipes);
