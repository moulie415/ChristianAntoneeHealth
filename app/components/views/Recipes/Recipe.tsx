import {RouteProp} from '@react-navigation/native';
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Pdf from 'react-native-pdf';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {connect} from 'react-redux';
import {StackParamList} from '../../../App';
import colors from '../../../constants/colors';
import {favouriteRecipe} from '../../../reducers/profile';
import {MyRootState} from '../../../types/Shared';
import Header from '../../commons/Header';
import Spinner from '../../commons/Spinner';

const Recipe: React.FC<{
  route: RouteProp<StackParamList, 'Recipe'>;
  favourites?: string[];
  favouriteRecipe: (recipe: string) => void;
}> = ({route, favourites, favouriteRecipe: favouriteRecipeAction}) => {
  const {recipe} = route.params;
  return (
    <SafeAreaView style={{backgroundColor: colors.appGrey, flex: 1}}>
      <Header
        hasBack
        title={recipe.name}
        right={
          <TouchableOpacity
            style={{}}
            onPress={() => favouriteRecipeAction(recipe.id)}>
            <Icon
              name="star"
              solid={favourites?.includes(recipe.id)}
              size={25}
              color={colors.secondaryLight}
            />
          </TouchableOpacity>
        }
      />

      <Pdf
        renderActivityIndicator={() => <Spinner />}
        source={{uri: recipe.recipe.src, cache: true}}
        style={{flex: 1}}
      />
      <TouchableOpacity
        style={{position: 'absolute', top: 60, right: 10, zIndex: 999}}
        onPress={() => favouriteRecipeAction(recipe.id)}>
        <Icon name="star" size={40} color={colors.secondaryLight} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  favourites: profile.profile.favouriteRecipes,
});

const mapDispatchToProps = {
  favouriteRecipe,
};

export default connect(mapStateToProps, mapDispatchToProps)(Recipe);
