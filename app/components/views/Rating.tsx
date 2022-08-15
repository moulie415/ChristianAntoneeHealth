import {View, ImageBackground} from 'react-native';
import React, { useState} from 'react';
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
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../commons/Header';

const Rating: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'Rating'>;
  profile: Profile;
}> = ({navigation, profile}) => {
  const [rating, setRating] = useState<number>();
  const [feedback, setFeedback] = useState('');
  const [disabled, setDisabled] = useState(false);

  return (
    <ImageBackground
      source={require('../../images/premium.jpg')}
      style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <Header hasBack title="Rate us" />
        <View style={{flex: 1, justifyContent: 'center'}}>
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
            value={feedback}
            onChangeText={setFeedback}
            multiline
            style={{
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
              Snackbar.show({text: 'Thank you!'});
              try {
                await api.sendFeedback(profile.uid, feedback, rating);
              } catch (e) {
                logError(e);
              }
            }}
            text="Submit"
            disabled={!rating || disabled}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(Rating);
