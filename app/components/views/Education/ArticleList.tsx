import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback} from 'react';
import {FlatList} from 'react-native';
import {connect} from 'react-redux';
import {RootState, StackParamList} from '../../../App';
import Education from '../../../types/Education';
import {Profile} from '../../../types/Shared';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import EducationCard from '../../commons/EducationCard';

const ArticleList: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'Education'>;
  profile: Profile;
  filtered: Education[];
}> = ({navigation, profile, filtered}) => {
  const onPress = useCallback(
    (item?: Education) => {
      if (item) {
        if (!profile.premium && item.premium) {
          navigation.navigate('Premium', {});
        } else {
          navigation.navigate('EducationArticle', {education: item});
        }
      }
    },
    [profile.premium, navigation],
  );

  const sorted = filtered?.sort((a, b) => {
    if (profile.premium) {
      return 0;
    }

    if (a.premium && !b.premium) {
      return 1;
    }
    if (b.premium && !a.premium) {
      return -1;
    }
    return 0;
  });

  return sorted.length ? (
    <FlatList
      data={filtered}
      renderItem={({item}) => {

        return <EducationCard item={item} onPress={onPress} />;
      }}
    />
  ) : (
    <AbsoluteSpinner loading />
  );
};

const mapStateToProps = ({profile}: RootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(ArticleList);
