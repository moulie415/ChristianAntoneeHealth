import {Layout, Text, Spinner, Divider, ListItem} from '@ui-kitten/components';
import React, {useEffect} from 'react';
import {ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {downloadRoutineVideo} from '../../../actions/quickRoutines';
import {getVideoHeight} from '../../../helpers';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {MyRootState} from '../../../types/Shared';
import QuickRoutineProps from '../../../types/views/QuickRoutine';
import ExerciseVideo from '../../commons/ExerciseVideo';
import colors from '../../../constants/colors';
import DevicePixels from '../../../helpers/DevicePixels';

const QuickRoutineView: React.FC<QuickRoutineProps> = ({
  downloadVideoAction,
  videos,
  loading,
  route,
}) => {
  const {routine} = route.params;
  useEffect(() => {
    downloadVideoAction(routine.id);
  }, [downloadVideoAction, routine]);
  const video: {src: string; path: string} | undefined = videos[routine.id];

  return (
    <Layout style={{flex: 1}}>
      <Layout
        style={{
          flexDirection: 'row',
          margin: DevicePixels[10],
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Layout
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
          <Icon
            name="stopwatch"
            size={DevicePixels[25]}
            color={colors.darkBlue}
          />
          <Text style={{marginLeft: DevicePixels[10]}} category="h5">
            {`Under ${routine.duration} minutes`}
          </Text>
        </Layout>
      </Layout>
      <ScrollView>
        <>
          {!loading &&
          video &&
          routine.video &&
          video.src === routine.video.src ? (
            <ExerciseVideo paused path={video.path} />
          ) : (
            <Layout
              style={{
                height: getVideoHeight(),
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Spinner />
            </Layout>
          )}
        </>
        <Layout>
          <Text style={{margin: DevicePixels[10], marginTop: 0}} category="h6">
            {routine.name}
          </Text>
          <Divider />
          <Text style={{margin: DevicePixels[10]}}>{routine.description}</Text>
        </Layout>
      </ScrollView>
    </Layout>
  );
};

const mapStateToProps = ({quickRoutines}: MyRootState) => ({
  loading: quickRoutines.videoLoading,
  videos: quickRoutines.videos,
});

const mapDispatchToProps = {
  downloadVideoAction: downloadRoutineVideo,
};

export default connect(mapStateToProps, mapDispatchToProps)(QuickRoutineView);
