import React, {useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import styles from '../../styles/views/Workout';
import {TouchableOpacity, ScrollView, SafeAreaView, View} from 'react-native';
import colors from '../../constants/colors';
import WorkoutProps from '../../types/views/Workout';
import {Text, Button, Layout, ListItem, Divider} from '@ui-kitten/components';
import {
  CardioType,
  CoolDown,
  Equipment,
  Goal,
  Level,
  MyRootState,
  StrengthArea,
  WarmUp,
} from '../../types/Shared';
import {setWorkout} from '../../actions/exercises';
import {connect} from 'react-redux';
import BottomSheet from 'reanimated-bottom-sheet';
import ImageOverlay from '../commons/ImageOverlay';
import DevicePixels from '../../helpers/DevicePixels';
import {capitalizeFirstLetter} from '../../helpers';

const Workout: React.FC<WorkoutProps> = ({
  navigation,
  setWorkoutAction,
  profile,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<Level>(Level.BEGINNER);
  const [goal, setGoal] = useState<Goal>(Goal.STRENGTH);
  const [selectedArea, setSelectedArea] = useState<StrengthArea>(
    StrengthArea.FULL,
  );
  const [cardioTYpe, setCardioType] = useState<CardioType>(CardioType.HIT);
  const [settings, setSetting] = useState<
    'goal' | 'experience' | 'equipment' | 'warmup'
  >();
  const [equipment, setEquipment] = useState<Equipment[]>();
  const sheetRef = useRef<BottomSheet>(null);
  const [warmUp, setWarmup] = useState<WarmUp>();
  const [coolDown, setCoolDown] = useState<CoolDown>();

  const renderHeader = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          backgroundColor: colors.button,
          alignItems: 'center',
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5,
        }}>
        <TouchableOpacity>
          <Text
            onPress={() => {
              sheetRef.current.snapTo(1);
              setModalOpen(false);
            }}
            style={{color: colors.appBlue, padding: 10}}>
            CANCEL
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text>Test</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={{color: colors.appBlue, padding: 10}}>SAVE</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderContent = () => {
    return (
      <View
        style={{
          backgroundColor: 'white',
          padding: 16,
          height: '100%',
        }}>
        <Text>Swipe down to close</Text>
      </View>
    );
  };
  return (
    <Layout style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <Text category="h5" style={{margin: DevicePixels[10], marginBottom: 0}}>
          Workout settings
        </Text>
        <ListItem
          style={{paddingVertical: DevicePixels[20]}}
          title="Fitness goals"
          onPress={() => {
            sheetRef.current.snapTo(0);
            setModalOpen(true);
          }}
          accessoryRight={() => {
            return (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    color: colors.appBlue,
                    marginRight: DevicePixels[5],
                    fontWeight: 'bold',
                  }}>
                  {goal === Goal.STRENGTH ? 'Strength' : 'Cardiovascular'}
                </Text>
                <Icon
                  name="chevron-right"
                  color={colors.appBlue}
                  size={DevicePixels[20]}
                />
              </View>
            );
          }}
        />
        <Divider />
        <ListItem
          style={{paddingVertical: DevicePixels[20]}}
          title="Exercise experience"
          onPress={() => {
            sheetRef.current.snapTo(0);
            setModalOpen(true);
          }}
          accessoryRight={() => {
            return (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    color: colors.appBlue,
                    marginRight: DevicePixels[5],
                    fontWeight: 'bold',
                  }}>
                  {capitalizeFirstLetter(selectedLevel)}
                </Text>
                <Icon
                  name="chevron-right"
                  color={colors.appBlue}
                  size={DevicePixels[20]}
                />
              </View>
            );
          }}
        />
        <Divider />
        <ListItem
          style={{paddingVertical: DevicePixels[20]}}
          title="Available equipment"
          onPress={() => {
            sheetRef.current.snapTo(0);
            setModalOpen(true);
          }}
          accessoryRight={() => {
            return (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    color: colors.appBlue,
                    marginRight: DevicePixels[5],
                    fontWeight: 'bold',
                  }}>
                  {!equipment || equipment.length === 0
                    ? 'None'
                    : `${equipment.length} selected`}
                </Text>
                <Icon
                  name="chevron-right"
                  color={colors.appBlue}
                  size={DevicePixels[20]}
                />
              </View>
            );
          }}
        />
        <Divider />
        <ListItem
          style={{paddingVertical: DevicePixels[20]}}
          title="Warm-up & Cool-down options"
          onPress={() => {
            sheetRef.current.snapTo(0);
            setModalOpen(true);
          }}
          accessoryRight={() => {
            return (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    color: colors.appBlue,
                    marginRight: DevicePixels[5],
                    fontWeight: 'bold',
                  }}>
                  {warmUp || coolDown ? 'On' : 'Off'}
                </Text>
                <Icon
                  name="chevron-right"
                  color={colors.appBlue}
                  size={DevicePixels[20]}
                />
              </View>
            );
          }}
        />
        <Divider />
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <Button
            disabled={false}
            onPress={() => {
              if (profile.premium) {
                setWorkoutAction([]);
                navigation.navigate('ExerciseList', {
                  strengthArea: selectedArea,
                  level: selectedLevel,
                  goal,
                });
              } else {
                navigation.navigate('Premium');
              }
            }}
            style={{margin: DevicePixels[10]}}>
            Continue
          </Button>
        </View>
        {modalOpen && (
          <Layout
            style={{
              position: 'absolute',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          />
        )}
      </SafeAreaView>
      <BottomSheet
        ref={sheetRef}
        snapPoints={['80%', 0]}
        initialSnap={1}
        onCloseStart={() => setModalOpen(false)}
        renderContent={renderContent}
        renderHeader={renderHeader}
      />
    </Layout>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

const mapDispatchToProps = {
  setWorkoutAction: setWorkout,
};

export default connect(mapStateToProps, mapDispatchToProps)(Workout);
