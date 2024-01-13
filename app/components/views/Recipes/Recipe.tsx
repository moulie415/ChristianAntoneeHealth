import {RouteProp} from '@react-navigation/native';
import React, {useCallback, useEffect} from 'react';
import {Platform} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import RNFS from 'react-native-fs';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Pdf from 'react-native-pdf';
import {SafeAreaView} from 'react-native-safe-area-context';
import Snackbar from 'react-native-snackbar';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {connect} from 'react-redux';
import {StackParamList} from '../../../App';
import colors from '../../../constants/colors';
import {logError} from '../../../helpers/error';
import {
  favouriteRecipe,
  setDownloadedDocument,
} from '../../../reducers/profile';
import {MyRootState} from '../../../types/Shared';
import Header from '../../commons/Header';
import Spinner from '../../commons/Spinner';

const Recipe: React.FC<{
  route: RouteProp<StackParamList, 'Recipe'>;
  favourites?: string[];
  favouriteRecipe: (recipe: string) => void;
  setDownloadedDocument: (payload: {id: string; path: string}) => void;
  downloadedDocuments: {[key: string]: string};
}> = ({
  route,
  favourites,
  favouriteRecipe: favouriteRecipeAction,
  setDownloadedDocument: setDownloadedDocumentAction,
  downloadedDocuments,
}) => {
  const {recipe} = route.params;

  const downloadFile = useCallback(async () => {
    try {
      if (
        !downloadedDocuments[recipe.id] ||
        !(await RNFS.exists(downloadedDocuments[recipe.id]))
      ) {
        const result = await ReactNativeBlobUtil.config({
          fileCache: true,
        }).fetch('GET', recipe.recipe.src);

        setDownloadedDocumentAction({id: recipe.id, path: result.path()});
      }
    } catch (e) {
      logError(e);
      Snackbar.show({text: 'Error downloading recipe'});
    }
  }, [
    recipe.id,
    recipe.recipe.src,
    setDownloadedDocumentAction,
    downloadedDocuments,
  ]);

  useEffect(() => {
    if (Platform.OS === 'android' && !downloadedDocuments[recipe.id]) {
      downloadFile();
    }
  }, [downloadFile, downloadedDocuments, recipe.id]);

  const source =
    Platform.OS === 'ios'
      ? {
          uri: recipe.recipe.src,
          cache: true,
        }
      : {uri: downloadedDocuments[recipe.id]};
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
        source={source}
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
  downloadedDocuments: profile.downloadedDocuments,
});

const mapDispatchToProps = {
  favouriteRecipe,
  setDownloadedDocument,
};

export default connect(mapStateToProps, mapDispatchToProps)(Recipe);
