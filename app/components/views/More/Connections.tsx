import {ButtonGroup, Input, Layout} from '@ui-kitten/components';
import React, {useState} from 'react';
import {connect} from 'react-redux';
import {MyRootState} from '../../../types/Shared';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Profile from '../../../types/Profile';
import Button from '../../commons/Button';
import {generateLink} from '../../../helpers/api';
import Clipboard from '@react-native-clipboard/clipboard';
import DevicePixels from '../../../helpers/DevicePixels';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';

const Connections: React.FC<{profile: Profile}> = ({profile}) => {
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState('');
  return (
    <Layout>
      <Input
        disabled
        style={{margin: DevicePixels[10]}}
        value={link}
        placeholder="Press button to generate link"
        accessoryRight={() =>
          link ? (
            <ButtonGroup>
              <Button>
                <Icon name="clipboard" />
              </Button>
              <Button>
                <Icon name="share-alt" />
              </Button>
            </ButtonGroup>
          ) : null
        }
      />
      <Button
        style={{margin: DevicePixels[10]}}
        disabled={!!link}
        onPress={async () => {
          setLoading(true);
          const data = await generateLink();
          setLoading(false);
          setLink(data);
        }}>
        Generate
      </Button>
      <Input />
      <AbsoluteSpinner loading={loading} />
    </Layout>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(Connections);
