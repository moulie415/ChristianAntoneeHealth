import {Layout, Text, Spinner, Divider, Button} from '@ui-kitten/components';
import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native';
import moment from 'moment';
import {connect} from 'react-redux';
import {downloadRoutineVideo} from '../../../actions/quickRoutines';
import {getVideoHeight} from '../../../helpers';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {MyRootState} from '../../../types/Shared';
import QuickRoutineProps from '../../../types/views/QuickRoutine';
import ExerciseVideo from '../../commons/ExerciseVideo';
import colors from '../../../constants/colors';
import DevicePixels from '../../../helpers/DevicePixels';
import Countdown from '../../commons/Countdown';

const QuickRoutineView: React.FC<QuickRoutineProps> = ({
  downloadVideoAction,
  videos,
  loading,
  route,
}) => {
  const {routine} = route.params;
  const video: {src: string; path: string} | undefined = videos[routine.id];
  const [started, setStarted] = useState(false);
  const [start, setStart] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    downloadVideoAction(routine.id);
  }, [downloadVideoAction, routine]);

  useEffect(() => {
    if (start) {
      const intervalID = setInterval(() => {
        setSeconds(moment().unix() - start);
        setPaused(false);
      }, 1000);
      return () => clearInterval(intervalID);
    }
  }, [start, started]);

  return (
    <Layout style={{flex: 1}}>
      {started && (
        <Countdown
          onComplete={() => {
            setStart(moment().unix());
          }}
        />
      )}
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
            {start && seconds
              ? moment().utc().startOf('day').add({seconds}).format('mm:ss')
              : `Under ${routine.duration} minutes`}
          </Text>
        </Layout>
      </Layout>
      <ScrollView>
        <>
          {!loading &&
          video &&
          routine.video &&
          video.src === routine.video.src ? (
            <ExerciseVideo
              paused={paused}
              path={video.path}
              onPause={() => setPaused(true)}
              onPlay={() => setPaused(false)}
            />
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
      <Button
        onPress={() => {
          if (!started) {
            setStarted(true);
          }
        }}
        style={{
          position: 'absolute',
          bottom: DevicePixels[20],
          right: DevicePixels[20],
          left: DevicePixels[20],
        }}>
        {started ? 'End' : 'Start'}
      </Button>
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
