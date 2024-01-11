import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import FileViewer from 'react-native-file-viewer';
import * as Progress from 'react-native-progress';
import Snackbar from 'react-native-snackbar';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {connect} from 'react-redux';
import colors from '../../../../constants/colors';
import {logError} from '../../../../helpers/error';
import {setDownloadedDocument} from '../../../../reducers/profile';
import Message from '../../../../types/Message';
import Profile from '../../../../types/Profile';
import {MyRootState} from '../../../../types/Shared';
import Text from '../../../commons/Text';

interface Props extends Message {
  profile: Profile;
  setDownloadedDocument: (payload: {id: string; path: string}) => void;
  downloadedDocuments: {[key: string]: string};
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
}) => {
  const [progress, setProgress] = useState(0);
  const downloadFile = async () => {
    try {
      const ext = mimeType?.split('/')[1];
      const result = await ReactNativeBlobUtil.config({
        path: `${ReactNativeBlobUtil.fs.dirs.DownloadDir}/${
          filename ?? id + '.' + ext
        }`,
      })
        .fetch('GET', document || '')
        .progress((received, total) => {
          const percentage = Number(received) / Number(total);
          setProgress(percentage);
        });

      await FileViewer.open(result.path());
      setDownloadedDocumentAction({id: id || '', path: result.path()});
    } catch (e) {
      logError(e);
      Snackbar.show({text: 'File download failed'});
    }
  };

  const file = downloadedDocuments[id || ''];

  const openFile = async () => {
    if (file) {
      try {
        await FileViewer.open(file);
      } catch (e) {
        await downloadFile();
      }
    } else {
      downloadFile();
    }
  };

  const isYou = user._id === profile.uid;
  return (
    <TouchableOpacity
      onPress={openFile}
      style={{
        padding: 10,
        margin: 10,
        borderRadius: 15,
        backgroundColor: isYou ? colors.appWhite : colors.appBlue,
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <Icon
        size={30}
        name="file"
        solid
        style={{color: isYou ? colors.appBlue : colors.appWhite}}
      />
      {file ? (
        <Text
          style={{
            color: isYou ? colors.appBlue : colors.appWhite,
            marginLeft: 10,
          }}>
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
          progress={progress}>
          <Icon
            name="download"
            size={10}
            style={{position: 'absolute'}}
            color={isYou ? colors.appBlue : colors.appWhite}
          />
        </Progress.Circle>
      )}
    </TouchableOpacity>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
  downloadedDocuments: profile.downloadedDocuments,
});

const mapDispatchToProps = {
  setDownloadedDocument,
};

export default connect(mapStateToProps, mapDispatchToProps)(DocumentMessage);
