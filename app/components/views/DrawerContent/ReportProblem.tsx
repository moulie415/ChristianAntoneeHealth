import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Sentry from '@sentry/react-native';
import React, { useState } from 'react';
import { Image, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Snackbar from 'react-native-snackbar';
import { StackParamList } from '../../../App';
import colors from '../../../constants/colors';
import { useAppSelector } from '../../../hooks/redux';
import Button from '../../commons/Button';
import Header from '../../commons/Header';
import Input from '../../commons/Input';

const ReportProblem: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'ReportProblem'>;
}> = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [problem, setProblem] = useState('');

  const { profile } = useAppSelector(state => state.profile);
  return (
    <View style={{ flex: 1, backgroundColor: colors.appGrey }}>
      <Image
        source={require('../../../images/upper_body.jpeg')}
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
      <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <View
            style={{
              padding: 20,
              paddingTop: 40,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              backgroundColor: colors.appGrey,
              height: 450,
            }}
          >
            <Input
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              style={{}}
            />
            <Input
              placeholder="Enter details of your problem here..."
              value={problem}
              onChangeText={setProblem}
              multiline
              style={{
                height: 200,
                marginVertical: 20,

                textAlignVertical: 'top',
              }}
            />
            <Button
              style={{ margin: 10 }}
              onPress={async () => {
                const sentryId =
                  Sentry.lastEventId() || Sentry.captureMessage(title);
                Sentry.captureUserFeedback({
                  name: `${profile.name} ${profile.surname || ''}`,
                  email: profile.email,
                  comments: `${title} - ${problem}`,
                  event_id: sentryId,
                });
                navigation.goBack();
                Snackbar.show({ text: 'Report sent' });
              }}
              text="Submit"
              disabled={!problem || !title}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default ReportProblem;
