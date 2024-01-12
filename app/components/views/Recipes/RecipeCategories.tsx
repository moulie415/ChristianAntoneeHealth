import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {Source} from 'react-native-fast-image';
import {FlatList} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackParamList} from '../../../App';
import colors from '../../../constants/colors';
import {RecipeCategory} from '../../../types/Shared';
import Header from '../../commons/Header';
import RecipeCategoryCard from './RecipeCategoryCard';

export const recipeCategories: {
  category: RecipeCategory;
  name: string;
  image: Source;
}[] = [
  {
    category: RecipeCategory.HIGH_PROTEIN,
    name: 'High protein',
    image: require('../../../images/high-protein.jpg'),
  },
  {
    category: RecipeCategory.VEGETARIAN,
    name: 'Vegetarian',
    image: require('../../../images/veggie.jpg'),
  },
  {
    category: RecipeCategory.VEGAN,
    name: 'Vegan',
    image: require('../../../images/vegan.jpg'),
  },
  {
    category: RecipeCategory.LOW_CARB,
    name: 'Low carb',
    image: require('../../../images/low-carb.jpg'),
  },
  {
    category: RecipeCategory.SMOOTHIE,
    name: 'Smoothie',
    image: require('../../../images/smoothie.jpg'),
  },
  {
    category: RecipeCategory.FIVE_INGREDIENT,
    name: '5-ingredient',
    image: require('../../../images/5-ingredient.jpg'),
  },
  {
    category: RecipeCategory.GLUTEN_FREE,
    name: 'Gluten free',
    image: require('../../../images/gluten-free.jpg'),
  },
];

const RecipeCategories: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'Recipes'>;
}> = ({navigation}) => {
  return (
    <SafeAreaView style={{backgroundColor: colors.appGrey, flex: 1}}>
      <Header hasBack title="Categories" />
      <FlatList
        data={recipeCategories}
        renderItem={({item}) => {
          return (
            <RecipeCategoryCard
              name={item.name}
              image={item.image}
              onPress={() =>
                navigation.navigate('Recipes', {category: item.category})
              }
            />
          );
        }}
      />
    </SafeAreaView>
  );
};

export default RecipeCategories;
