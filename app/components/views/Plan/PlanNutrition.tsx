import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import * as _ from 'lodash';
import React, {useEffect, useMemo} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {connect} from 'react-redux';
import {StackParamList} from '../../../App';
import colors from '../../../constants/colors';
import {getRecipesById} from '../../../reducers/recipes';
import {MyRootState, Recipe} from '../../../types/Shared';
import Header from '../../commons/Header';
import RecipeCard from '../Recipes/RecipeCard';

const PlanNutrition: React.FC<{
  route: RouteProp<StackParamList, 'Nutrition'>;
  navigation: NativeStackNavigationProp<StackParamList, 'Nutrition'>;
  getRecipesById: (ids: string[]) => void;
  recipes: {[key: string]: Recipe};
}> = ({route, recipes, getRecipesById: getRecipesByIdAction, navigation}) => {
  const {nutrition} = route.params;

  useEffect(() => {
    const getMissingRecipes = () => {
      if (nutrition) {
        const {postWorkoutRecipes, preWorkoutRecipes, generalRecipes} =
          nutrition;
        if (
          postWorkoutRecipes?.length ||
          preWorkoutRecipes?.length ||
          generalRecipes?.length
        ) {
          const ids = _.uniq(
            [
              ...(postWorkoutRecipes || []),
              ...(preWorkoutRecipes || []),
              ...(generalRecipes || []),
            ].map(r => r),
          ).filter(r => !recipes[r]);
          getRecipesByIdAction(ids);
        }
      }
    };
    getMissingRecipes();
  }, [nutrition, recipes, getRecipesByIdAction]);

  const generalRecipes = useMemo(() => {
    return (
      nutrition?.generalRecipes?.filter(r => recipes[r]).map(r => recipes[r]) ||
      []
    );
  }, [nutrition?.generalRecipes, recipes]);

  const postWorkoutRecipes = useMemo(() => {
    return (
      nutrition?.postWorkoutRecipes
        ?.filter(r => recipes[r])
        .map(r => recipes[r]) || []
    );
  }, [nutrition?.postWorkoutRecipes, recipes]);

  const preWorkoutRecipes = useMemo(() => {
    return (
      nutrition?.preWorkoutRecipes
        ?.filter(r => recipes[r])
        .map(r => recipes[r]) || []
    );
  }, [nutrition?.preWorkoutRecipes, recipes]);

  return (
    <ScrollView bounces={false} style={{backgroundColor: colors.appGrey}}>
      <FastImage
        style={{
          height: 350,
          marginBottom: 10,
        }}
        source={require('../../../images/nutrition.jpg')}>
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: '#000',
            opacity: 0.4,
          }}
        />
      </FastImage>

      <Header hasBack absolute title="Nutrition" />

      <View
        style={{
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          marginTop: -100,
          paddingBottom: 40,
          backgroundColor: colors.appGrey,
        }}>
        {!!nutrition.general && (
          <>
            <Text
              style={{
                fontSize: 25,
                fontWeight: 'bold',
                padding: 20,
                paddingBottom: 0,
                fontFamily: 'Helvetica',
                color: colors.appWhite,
              }}>
              General
            </Text>
            <Text
              style={{
                color: colors.appWhite,
                padding: 20,
                paddingVertical: 10,
              }}>
              {nutrition.general}
            </Text>
            {generalRecipes.map(r => {
              return (
                <RecipeCard
                  key={r.id}
                  name={r.name}
                  image={r.image.src}
                  onPress={() => navigation.navigate('Recipe', {recipe: r})}
                />
              );
            })}
          </>
        )}
        {!!nutrition.preWorkout && (
          <>
            <Text
              style={{
                fontSize: 25,
                fontWeight: 'bold',
                paddingHorizontal: 20,
                paddingTop: 10,
                fontFamily: 'Helvetica',
                color: colors.appWhite,
              }}>
              Pre-workout
            </Text>
            <Text
              style={{
                color: colors.appWhite,
                padding: 20,
                paddingVertical: 10,
              }}>
              {nutrition.preWorkout}
            </Text>
            {preWorkoutRecipes.map(r => {
              return (
                <RecipeCard
                  key={r.id}
                  name={r.name}
                  image={r.image.src}
                  onPress={() => navigation.navigate('Recipe', {recipe: r})}
                />
              );
            })}
          </>
        )}
        {!!nutrition.postWorkout && (
          <>
            <Text
              style={{
                fontSize: 25,
                fontWeight: 'bold',
                paddingHorizontal: 20,
                paddingTop: 10,
                fontFamily: 'Helvetica',
                color: colors.appWhite,
              }}>
              Post-workout
            </Text>
            <Text
              style={{
                color: colors.appWhite,
                padding: 20,
                paddingVertical: 10,
              }}>
              {nutrition.postWorkout}
            </Text>
            {postWorkoutRecipes.map(r => {
              return (
                <RecipeCard
                  key={r.id}
                  name={r.name}
                  image={r.image.src}
                  onPress={() => navigation.navigate('Recipe', {recipe: r})}
                />
              );
            })}
          </>
        )}
      </View>
    </ScrollView>
  );
};

const mapStateToProps = ({recipes}: MyRootState) => ({
  recipes: recipes.recipes,
});

const mapDispatchToProps = {
  getRecipesById,
};

export default connect(mapStateToProps, mapDispatchToProps)(PlanNutrition);
