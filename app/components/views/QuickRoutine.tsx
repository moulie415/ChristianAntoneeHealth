import {Layout, Text, Spinner, Divider, ListItem} from '@ui-kitten/components';
import React, {useEffect} from 'react';
import {ScrollView} from 'react-native';
import {connect} from 'react-redux';
import {downloadRoutineVideo} from '../../actions/quickRoutines';
import {getVideoHeight} from '../../helpers';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {MyRootState} from '../../types/Shared';
import QuickRoutineProps from '../../types/views/QuickRoutine';
import ExerciseVideo from '../commons/ExerciseVideo';
import colors from '../../constants/colors';

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
          margin: 10,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Layout
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-end',
          }}>
          <Icon name="stopwatch" size={25} color={colors.darkBlue} />
          <Text style={{marginLeft: 10}} category="h5">
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
          <Text style={{margin: 10, marginTop: 0}} category="h6">
            {routine.name}
          </Text>
          <Divider />
          <ListItem title="Focus" description={routine.focus} />
          <Divider />
          <ListItem title="Equipment" description={routine.equipment} />
          <Divider />
          <ListItem title="Level" description={routine.level} />
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
