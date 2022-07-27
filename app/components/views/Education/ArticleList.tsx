import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import moment from 'moment';
import React, {useCallback, useEffect, useState} from 'react';
import {TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Image from 'react-native-fast-image';
import {connect} from 'react-redux';
import {StackParamList} from '../../../App';
import {AD_KEYWORDS, UNIT_ID_INTERSTITIAL} from '../../../constants';
import DevicePixels from '../../../helpers/DevicePixels';
import Education from '../../../types/Education';
import Profile from '../../../types/Profile';
import {MyRootState} from '../../../types/Shared';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import {SettingsState} from '../../../reducers/settings';
import {useInterstitialAd} from 'react-native-google-mobile-ads';
import ListItem from '../../commons/ListItem';

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
        return (
          <>
            <ListItem
              title={item.title}
              onPress={() => onPress(item)}
              description={moment(item.createdate).format('DD MMMM YYYY')}
              accessoryLeft={
                item.premium && !profile.premium ? (
                  <Icon
                    name="lock"
                    size={DevicePixels[30]}
                    style={{margin: DevicePixels[10]}}
                  />
                ) : (
                  <Image
                    style={{width: DevicePixels[75], height: DevicePixels[50]}}
                    source={{uri: item.image.src}}
                  />
                )
              }
            />
            {item.premium && !profile.premium && (
              <TouchableOpacity
                onPress={() => onPress(item)}
                style={{
                  ...StyleSheet.absoluteFillObject,
                  backgroundColor: '#000',
                  opacity: 0.7,
                }}
              />
            )}
          </>
        );
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
