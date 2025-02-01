import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useState} from 'react';
import {View} from 'react-native';
import {StackParamList} from '../../App';

import FastImage from 'react-native-fast-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Snackbar from 'react-native-snackbar';
import StarRating from 'react-native-star-rating-widget';
import colors from '../../constants/colors';
import {rateApp} from '../../helpers';
import * as api from '../../helpers/api';
import {logError} from '../../helpers/error';
import {useAppDispatch, useAppSelector} from '../../hooks/redux';
import {updateProfile} from '../../reducers/profile';
import Button from '../commons/Button';
import Header from '../commons/Header';
import Input from '../commons/Input';

const Rating: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'Rating'>;
}> = ({navigation}) => {
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const {profile} = useAppSelector(state => state.profile);
  const dispatch = useAppDispatch();

  return (
    <View style={{flex: 1, backgroundColor: colors.appGrey}}>
      <FastImage
        source={require('../../images/upper_body.jpeg')}
        style={{
          flex: 1,
          position: 'absolute',
          top: 0,
          height: '50%',
          left: 0,
          right: 0,
        }}
      />
      <Header hasBack absolute />
      <KeyboardAwareScrollView contentContainerStyle={{flex: 1}}>
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <View
            style={{
              padding: 20,
              paddingTop: 40,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              backgroundColor: colors.appGrey,
              height: 450,
            }}>
            <StarRating
              color="#FFC24C"
              emptyColor="#6a4f1f"
              style={{alignSelf: 'center'}}
              starSize={50}
              rating={rating}
              onChange={setRating}
            />
            <Input
              placeholder="Give us feedback here (optional)"
              value={feedback}
              onChangeText={setFeedback}
              multiline
              style={{
                height: 200,
                marginVertical: 20,
                textAlignVertical: 'top',
              }}
            />
            <Button
              style={{margin: 10}}
              onPress={async () => {
                setLoading(true);
                if (rating && rating > 3) {
                  rateApp();
                } else {
                }
                navigation.goBack();
                Snackbar.show({text: 'Thank you!'});
                try {
                  if (rating) {
                    await api.sendFeedback(profile.uid, feedback, rating);
                    if (!profile.hasLeftFeedback) {
                      dispatch(
                        updateProfile({
                          disableSnackbar: true,
                          hasLeftFeedback: true,
                        }),
                      );
                    }
                  }
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
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Rating;
