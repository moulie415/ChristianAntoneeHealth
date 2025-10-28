import * as Clipboard from 'expo-clipboard';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import React, { useState } from 'react';
import { generateLink } from '../../../helpers/api';

import { ImageBackground, Share, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Snackbar from 'react-native-snackbar';
import { connect } from 'react-redux';
import { RootState } from '../../../App';
import colors from '../../../constants/colors';
import { logError } from '../../../helpers/error';
import { Profile } from '../../../types/Shared';
import Button from '../../commons/Button';
import Header from '../../commons/Header';
import IconButton from '../../commons/IconButton';
import Input from '../../commons/Input';
import Text from '../../commons/Text';

const AddConnection: React.FC<{ profile: Profile }> = ({ profile }) => {
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState('');
  return (
    <ImageBackground
      source={require('../../../images/login.jpeg')}
      blurRadius={5}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <Header title="Add friend" hasBack />
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: colors.appBlack,
            opacity: 0.5,
          }}
        />
        <Text
          style={{
            color: colors.appWhite,
            margin: 10,
            marginTop: 0,
          }}
        >
          Send an invite link to someone you want to connect with, this link
          will only work once, please only send it to someone you wish to
          connect with
        </Text>
        <Input
          disabled
          containerStyle={{ margin: 10 }}
          value={link}
          placeholder="Press button to generate link"
          accessoryRight={
            link ? (
              <>
                <IconButton
                  icon="clipboard"
                  style={{ marginRight: 5 }}
                  onPress={async () => {
                    await Clipboard.setStringAsync(link);
                    Snackbar.show({ text: 'Link copied to clipboard!' });
                  }}
                >
                  <FontAwesome6 name="clipboard" />
                </IconButton>
                <IconButton
                  icon="share-alt"
                  onPress={async () => {
                    try {
                      const { action } = await Share.share({
                        title: 'CA Health',
                        url: link,
                        message: `${profile.name} has invited you to connect on CA Health, click the link to connect: ${link}`,
                      });
                      if (action === 'sharedAction') {
                        Snackbar.show({ text: 'Link shared successfully' });
                      }
                    } catch (e) {
                      Snackbar.show({ text: 'Error sharing link' });
                      logError(e);
                    }
                  }}
                />
              </>
            ) : null
          }
        />
        <Button
          text="Generate"
          style={{ margin: 10 }}
          disabled={!!link || loading}
          loading={loading}
          onPress={async () => {
            setLoading(true);
            const data = await generateLink();

            setLoading(false);
            if (data) {
              setLink(data);
            }
          }}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

const mapStateToProps = ({ profile }: RootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(AddConnection);
