import {View, Text, Platform, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../App';
import DevicePixels from '../../helpers/DevicePixels';
import colors from '../../constants/colors';
import StarRating from 'react-native-star-rating';
import {rateApp} from '../../helpers';
import Button from '../commons/Button';
import Input from '../commons/Input';
import Snackbar from 'react-native-snackbar';
import {MyRootState} from '../../types/Shared';
import {connect} from 'react-redux';
import Profile from '../../types/Profile';
import * as api from '../../helpers/api';
import {logError} from '../../helpers/error';
import {Layout} from '@ui-kitten/components';

const Rating: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'Rating'>;
  profile: Profile;
}> = ({navigation, profile}) => {
  const [rating, setRating] = useState<number>();
  const [feedback, setFeedback] = useState('');
  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    if (Platform.OS === 'ios') {
      navigation.setOptions({
        headerLeft: () => (
          <TouchableOpacity
            style={{padding: DevicePixels[10]}}
            onPress={() => navigation.goBack()}>
            <Text style={{color: colors.appBlue}}>Cancel</Text>
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation]);
  return (
    <Layout style={{flex: 1, justifyContent: 'center'}}>
      <StarRating
        containerStyle={{marginHorizontal: DevicePixels[40]}}
        fullStarColor={colors.appBlue}
        rating={rating}
        selectedStar={star => {
          setRating(star);
        }}
      />
      <Input
        placeholder="Give us feedback here (optional)"
        style={{margin: DevicePixels[20]}}
        value={feedback}
        onChangeText={setFeedback}
        multiline
        textStyle={{
          height: DevicePixels[50],
          textAlignVertical: 'top',
        }}
      />
      <Button
        style={{alignSelf: 'center', margin: DevicePixels[10]}}
        onPress={async () => {
          setDisabled(true);
          if (rating > 3) {
            rateApp();
          } else {
          }
          navigation.goBack();
          Snackbar.show({text: 'Thank you'});
          try {
            await api.sendFeedback(profile.uid, feedback, rating);
          } catch (e) {
            logError(e);
          }
        }}
        disabled={!rating || disabled}>
        Submit
      </Button>
    </Layout>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(Rating);
