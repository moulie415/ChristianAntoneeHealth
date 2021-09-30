import {Layout, Text, Spinner} from '@ui-kitten/components';
import React, {useEffect} from 'react';
import {ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {downloadRoutineVideo} from '../../actions/quickRoutines';
import {getVideoHeight} from '../../helpers';
import QuickRoutine from '../../types/QuickRoutines';
import {MyRootState} from '../../types/Shared';
import QuickRoutineProps from '../../types/views/QuickRoutine';
import ExerciseVideo from '../commons/ExerciseVideo';

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
                marginBottom: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Spinner />
            </Layout>
          )}
        </>
        <Layout
          style={{
            marginHorizontal: 10,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={{flex: 4}} category="h6">
            {routine.name}
          </Text>
          <Layout style={{flex: 2, alignItems: 'flex-end'}}>
            {/* <Text>{`${exercise.reps} repetitions`}</Text>
            <Text>{`x${exercise.sets} sets`}</Text> */}
          </Layout>
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
