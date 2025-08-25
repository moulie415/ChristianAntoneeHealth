import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import FileViewer from 'react-native-file-viewer';
import * as Progress from 'react-native-progress';
import Snackbar from 'react-native-snackbar';
import { connect } from 'react-redux';
import { RootState } from '../../../../App';
import colors from '../../../../constants/colors';
import { logError } from '../../../../helpers/error';
import { setDownloadedDocument } from '../../../../reducers/profile';
import Message from '../../../../types/Message';
import { Profile } from '../../../../types/Shared';
import Text from '../../../commons/Text';

interface Props extends Message {
  profile: Profile;
  setDownloadedDocument: (payload: { id: string; path: string }) => void;
  downloadedDocuments: { [key: string]: string };
  onLongPress: () => void;
}

const DocumentMessage: React.FC<Props> = ({
  document,
  user,
  profile,
  mimeType,
  id,
  filename,
  setDownloadedDocument: setDownloadedDocumentAction,
  downloadedDocuments,
  onLongPress,
}) => {
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const downloadFile = async () => {
    try {
      const ext = mimeType?.split('/')[1];
      const result = await ReactNativeBlobUtil.config({
        path: `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${
          filename ?? id + '.' + ext
        }`,
      })
        .fetch('GET', document || '')
        .progress((received, total) => {
          const percentage = Number(received) / Number(total);
          setProgress(percentage);
        });
      await FileViewer.open(result.path());
      setDownloadedDocumentAction({ id: id || '', path: result.path() });
    } catch (e) {
      logError(e);
      Snackbar.show({ text: 'File download failed' });
    }
  };

  const file = downloadedDocuments[id || ''];

  const openFile = async () => {
    setDownloading(true);
    if (file) {
      try {
        await FileViewer.open(file);
      } catch (e) {
        setDownloadedDocumentAction({ id: id || '', path: '' });
        await downloadFile();
      }
    } else {
      downloadFile();
    }
    setDownloading(false);
  };

  const isYou = user._id === profile.uid;
  return (
    <TouchableOpacity
      disabled={downloading}
      onLongPress={onLongPress}
      onPress={openFile}
      style={{
        padding: 10,
        margin: 10,
        borderRadius: 15,
        backgroundColor: isYou ? colors.appWhite : colors.appBlue,
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <FontAwesome6
        size={30}
        name="file"
        iconStyle="solid"
        style={{ color: isYou ? colors.appBlue : colors.appWhite }}
      />
      {file ? (
        <Text
          style={{
            color: isYou ? colors.appBlue : colors.appWhite,
            marginLeft: 10,
          }}
        >
          {filename}
        </Text>
      ) : (
        <Progress.Circle
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 10,
          }}
          size={25}
          fill="transparent"
          thickness={2}
          unfilledColor={colors.offWhite}
          borderWidth={0}
          color={isYou ? colors.appBlue : colors.appWhite}
          progress={progress}
        >
          <FontAwesome6
            iconStyle="solid"
            name="download"
            size={10}
            style={{ position: 'absolute' }}
            color={isYou ? colors.appBlue : colors.appWhite}
          />
        </Progress.Circle>
      )}
    </TouchableOpacity>
  );
};

const mapStateToProps = ({ profile }: RootState) => ({
  profile: profile.profile,
  downloadedDocuments: profile.downloadedDocuments,
});

const mapDispatchToProps = {
  setDownloadedDocument,
};

export default connect(mapStateToProps, mapDispatchToProps)(DocumentMessage);
