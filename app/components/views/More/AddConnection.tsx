import {ButtonGroup, Input, Spinner} from '@ui-kitten/components';
import React, {useState} from 'react';
import {generateLink} from '../../../helpers/api';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Clipboard from '@react-native-clipboard/clipboard';
import DevicePixels from '../../../helpers/DevicePixels';
import Button from '../../commons/Button';
import Snackbar from 'react-native-snackbar';
import {Share, View} from 'react-native';
import {MyRootState} from '../../../types/Shared';
import {connect} from 'react-redux';
import Profile from '../../../types/Profile';
import {logError} from '../../../helpers/error';

const AddConnection: React.FC<{profile: Profile}> = ({profile}) => {
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState('');
  return (
    <View style={{flex: 1}}>
      <Input
        label="Send an invite link to someone you want to connect with, this link will only work once, please only send it to someone you wish to connect with"
        disabled
        style={{margin: DevicePixels[10]}}
        value={link}
        placeholder="Press button to generate link"
        accessoryRight={() =>
          link ? (
            <ButtonGroup>
              <Button
                onPress={() => {
                  Clipboard.setString(link);
                  Snackbar.show({text: 'Link copied to clipboard!'});
                }}>
                <Icon name="clipboard" />
              </Button>
              <Button
                onPress={async () => {
                  try {
                    const {action} = await Share.share({
                      title: 'CA Health',
                      url: link,
                      message: `${profile.name} has invited you to connect on CA Health, click the link to connect: ${link}`,
                    });
                    if (action === 'sharedAction') {
                      Snackbar.show({text: 'Link shared successfully'});
                    }
                  } catch (e) {
                    Snackbar.show({text: 'Error sharing link'});
                    logError(e);
                  }
                }}>
                <Icon name="share-alt" />
              </Button>
            </ButtonGroup>
          ) : null
        }
      />
      <Button
        style={{margin: DevicePixels[10]}}
        disabled={!!link || loading}
        accessoryLeft={() => (loading ? <Spinner /> : null)}
        onPress={async () => {
          setLoading(true);
          const data = await generateLink();

          setLoading(false);
          setLink(data);
        }}>
        Generate
      </Button>
    </View>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(AddConnection);
