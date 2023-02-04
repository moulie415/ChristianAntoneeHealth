import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useCallback, useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import {connect} from 'react-redux';
import {StackParamList} from '../../../App';
import {AD_KEYWORDS, UNIT_ID_INTERSTITIAL} from '../../../constants';

import Education from '../../../types/Education';
import Profile from '../../../types/Profile';
import {MyRootState} from '../../../types/Shared';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import {SettingsState} from '../../../reducers/settings';
import {useInterstitialAd} from 'react-native-google-mobile-ads';
import EducationCard from '../../commons/EducationCard';

const ArticleList: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'Education'>;
  profile: Profile;
  filtered: Education[];
  loading: boolean;
  settings: SettingsState;
}> = ({navigation, profile, filtered, loading, settings}) => {
  const [selectedItem, setSelectedItem] = useState<Education>();
  const {load, show, isLoaded, isClosed} = useInterstitialAd(
    UNIT_ID_INTERSTITIAL,
    {
      keywords: AD_KEYWORDS,
    },
  );
  useEffect(() => {
    if (settings.ads) {
      load();
    }
  }, [settings.ads, load]);

  useEffect(() => {
    if (isClosed && settings.ads) {
      load();
    }
  }, [isClosed, load, settings.ads]);

  useEffect(() => {
    if (isClosed && selectedItem) {
      navigation.navigate('EducationArticle', {education: selectedItem});
    }
  }, [isClosed, navigation, selectedItem]);

  const onPress = useCallback(
    (item: Education) => {
      if (item.premium) {
        if (profile.premium) {
          navigation.navigate('EducationArticle', {education: item});
        } else {
          navigation.navigate('Premium');
        }
      } else if (profile.premium) {
        navigation.navigate('EducationArticle', {education: item});
      } else {
        if (isLoaded && settings.ads) {
          show();
          setSelectedItem(item);
        } else {
          navigation.navigate('EducationArticle', {education: item});
        }
      }
    },
    [profile.premium, navigation, isLoaded, show, settings.ads],
  );
  return filtered.length ? (
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

const mapStateToProps = ({profile, education, settings}: MyRootState) => ({
  profile: profile.profile,
  loading: education.loading,
  settings,
});

export default connect(mapStateToProps)(ArticleList);
