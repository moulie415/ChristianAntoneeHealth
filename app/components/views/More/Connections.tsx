import {ButtonGroup, Input, Layout, Spinner} from '@ui-kitten/components';
import React, {useState} from 'react';
import {connect} from 'react-redux';
import {MyRootState} from '../../../types/Shared';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Profile from '../../../types/Profile';
import Button from '../../commons/Button';
import {generateLink} from '../../../helpers/api';
import Clipboard from '@react-native-clipboard/clipboard';
import DevicePixels from '../../../helpers/DevicePixels';
import Snackbar from 'react-native-snackbar';
import {Share} from 'react-native';

const Connections: React.FC<{profile: Profile}> = ({profile}) => {
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState('');
  return (
    <Layout style={{flex: 1}}>
      <Input
        label="Send an invite link to people you want to connect with, this link will only work for today but please only send it to people you want to connect with as anyone can use it"
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
                onPress={() => {
                  Share.share({
                    title: 'Health and Movement',
                    url: link,
                    message: `${profile.name} has invited you to connect on Health and Movement, click the link to connect: ${link}`,
                  });
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
    </Layout>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(Connections);
