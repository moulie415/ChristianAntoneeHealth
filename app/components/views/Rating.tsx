import {View, ImageBackground} from 'react-native';
import React, {useState} from 'react';
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
import FastImage from 'react-native-fast-image';

const Rating: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'Rating'>;
  profile: Profile;
}> = ({navigation, profile}) => {
  const [rating, setRating] = useState<number>();
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <FastImage
      source={require('../../images/login.jpeg')}
      style={{flex: 1}}
      blurRadius={5}>
      <SafeAreaView style={{flex: 1}}>
        <Header hasBack title="Rate us" />
      </SafeAreaView>
      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <View
          style={{
            padding: DevicePixels[20],
            paddingTop: DevicePixels[40],
            borderTopLeftRadius: DevicePixels[30],
            borderTopRightRadius: DevicePixels[30],
            backgroundColor: 'rgba(0,0,0,0.8)',
            height: DevicePixels[450],
          }}>
          <StarRating
            containerStyle={{marginHorizontal: DevicePixels[40]}}
            fullStarColor="#FFC24C"
            emptyStarColor="#6a4f1f"
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
              height: DevicePixels[200],
              marginVertical: DevicePixels[20],
              textAlignVertical: 'top',
            }}
          />
          <Button
            style={{margin: DevicePixels[10]}}
            onPress={async () => {
              setLoading(true);
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
            loading={loading}
            disabled={!rating || loading}
          />
        </View>
      </View>
    </FastImage>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(Rating);
