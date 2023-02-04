import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import moment from 'moment';
import React, {useCallback, useEffect, useState} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ImageBackground,
  View,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Image from 'react-native-fast-image';
import {connect} from 'react-redux';
import {StackParamList} from '../../../App';
import {AD_KEYWORDS, UNIT_ID_INTERSTITIAL} from '../../../constants';

import Education from '../../../types/Education';
import Profile from '../../../types/Profile';
import {MyRootState} from '../../../types/Shared';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import {SettingsState} from '../../../reducers/settings';
import {useInterstitialAd} from 'react-native-google-mobile-ads';
import ListItem from '../../commons/ListItem';
import Text from '../../commons/Text';
import colors from '../../../constants/colors';
import FastImage from 'react-native-fast-image';
import FastImageAnimated from '../../commons/FastImageAnimated';

const {height, width} = Dimensions.get('window');

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
          <TouchableOpacity
            style={{
              height: 125,
              marginHorizontal: 20,
              marginBottom: 15,
              borderRadius: 10,
              overflow: 'hidden',
            }}
            onPress={() => onPress(item)}>
            <FastImageAnimated
              style={{
                position: 'absolute',
                height: 125,
                width: '100%',
              }}
              source={{uri: item.image.src}}
            />

            <View
              style={{
                position: 'absolute',
                alignSelf: 'flex-end',
                right: 0,
                top: 0,
                bottom: 0,
                width: width / 1.5,
                padding: 10,
                backgroundColor: 'rgba(0,0,0,0.7)',
              }}>
              <Text
                style={{
                  color: colors.appWhite,
                  fontSize: 10,
                }}>
                {moment(item.createdate).format('DD MMMM YYYY')}
              </Text>
              <Text
                style={{
                  color: colors.appWhite,
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>
                {item.title}
              </Text>

              {item.premium && !profile.premium && (
                <View
                  style={{
                    position: 'absolute',
                    bottom: 15,
                    right: 15,
                  }}>
                  <Icon
                    name="lock"
                    size={20}
                    color={colors.appWhite}
                  />
                </View>
              )}
            </View>
          </TouchableOpacity>
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
