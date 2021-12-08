import {Layout, Text, Spinner, Divider, Button} from '@ui-kitten/components';
import React, {useEffect, useState} from 'react';
import {ScrollView, Dimensions} from 'react-native';
import moment from 'moment';
import Carousel from 'react-native-snap-carousel';
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
import globalStyles from '../../../styles/globalStyles';

const {width, height} = Dimensions.get('screen');

const QuickRoutineView: React.FC<QuickRoutineProps> = ({
  downloadVideoAction,
  videos,
  loading,
  route,
  navigation,
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

  const carouselItems = routine.exercises || [];

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
      <ScrollView contentContainerStyle={{paddingBottom: DevicePixels[30]}}>
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
          <Carousel
            vertical={false}
            data={carouselItems}
            sliderWidth={width}
            itemWidth={width - DevicePixels[75]}
            renderItem={({item, index}) => {
              return (
                <Layout
                  style={{
                    marginVertical: DevicePixels[20],
                    borderRadius: DevicePixels[10],
                    ...globalStyles.boxShadow,
                  }}>
                  <Layout
                    style={{
                      borderRadius: DevicePixels[10],
                      backgroundColor: '#fff',
                      height: DevicePixels[300],
                      padding: DevicePixels[20],
                    }}>
                    <Text style={{lineHeight: DevicePixels[20]}}>{item}</Text>
                  </Layout>
                </Layout>
              );
            }}
          />
        </Layout>
        <Button
          onPress={() => {
            if (!started) {
              setStarted(true);
            } else {
              navigation.navigate('EndQuickRoutine', {seconds, routine});
            }
          }}
          style={{margin: DevicePixels[10]}}>
          {started ? 'End' : 'Start'}
        </Button>
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