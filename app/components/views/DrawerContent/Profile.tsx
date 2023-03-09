import React, {useCallback, useEffect, useState} from 'react';
import {TouchableOpacity, ScrollView, View, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import styles from '../../../styles/views/Profile';
import ProfileProps from '../../../types/views/Profile';
import {connect} from 'react-redux';
import {MyRootState, Sample} from '../../../types/Shared';
import colors from '../../../constants/colors';
import Profile, {Gender, Unit} from '../../../types/Profile';
import * as _ from 'lodash';
import {
  getSamples,
  updateProfile,
  UpdateProfilePayload,
} from '../../../actions/profile';
import {
  BONE_DENSITIES,
  HEIGHTS,
  MUSCLE_MASSES,
  PERCENTAGES,
  WEIGHTS,
} from '../../../constants';

import Avatar from '../../commons/Avatar';
import {
  launchCamera,
  launchImageLibrary,
  CameraOptions,
  ImageLibraryOptions,
  ImagePickerResponse,
} from 'react-native-image-picker';
import Snackbar from 'react-native-snackbar';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import {logError} from '../../../helpers/error';
import storage from '@react-native-firebase/storage';
import Text from '../../commons/Text';
import Button from '../../commons/Button';
import Header from '../../commons/Header';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import PickerModal from '../../commons/PickerModal';
import ProfileCharts from '../../commons/ProfileCharts';
import Divider from '../../commons/Divider';
import Spinner from '../../commons/Spinner';
import Animated, {FadeIn} from 'react-native-reanimated';
import {StackParamList} from '../../../App';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const ProfileComponent: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'Profile'>;
  profile: Profile;
  updateProfileAction: (payload: UpdateProfilePayload) => void;
  getSamplesAction: () => void;
}> = ({profile, navigation, updateProfileAction, getSamplesAction}) => {
  const [gender, setGender] = useState<Gender>(
    (profile.gender as Gender) || null,
  );
  const [weight, setWeight] = useState<number>(profile.weight || 0);
  const [dob, setDob] = useState(profile.dob);
  const [height, setHeight] = useState<number>(profile.height || 0);
  const [unit, setUnit] = useState<Unit>(profile.unit || 'metric');
  const [avatar, setAvatar] = useState(profile.avatar);
  const [loading, setLoading] = useState(false);
  const [showHeightModal, setShowHeightModal] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);

  const [showBodyFatPercentageModal, setShowBodyFatPercentageModal] =
    useState(false);
  const [bodyFatPercentage, setBodyFatPercentage] = useState(
    profile.bodyFatPercentage,
  );

  const [showMuscleMassModal, setShowMuscleMassModal] = useState(false);
  const [muscleMass, setMuscleMass] = useState(profile.muscleMass);

  const [showBoneMassModal, setShowBoneMassModal] = useState(false);
  const [boneMass, setBoneMass] = useState(profile.boneMass);

  const newProfile = {
    ...profile,
    gender,
    weight,
    dob,
    height,
    unit,
    ...(avatar !== undefined ? {avatar} : {}),
    ...(bodyFatPercentage !== undefined ? {bodyFatPercentage} : {}),
    ...(muscleMass !== undefined ? {muscleMass} : {}),
    ...(boneMass !== undefined ? {boneMass} : {}),
  };

  const equal = _.isEqual(newProfile, profile);

  const handlePickerCallback = useCallback(
    async (response: ImagePickerResponse) => {
      if (response.errorMessage || response.errorCode) {
        Snackbar.show({
          text: `Error: ${response.errorMessage || response.errorCode}`,
        });
      } else if (!response.didCancel) {
        const image = response.assets?.[0];
        setAvatar(image?.uri);
      }
    },
    [],
  );

  const onSave = async () => {
    try {
      setLoading(true);
      let newAvatar = profile.avatar;
      if (avatar !== profile.avatar) {
        const imageRef = storage().ref(`images/${profile.uid}`).child('avatar');
        await imageRef.putFile(avatar || '');
        newAvatar = await imageRef.getDownloadURL();
      }
      navigation.goBack();
      updateProfileAction({
        gender,
        dob,
        height,
        weight,
        unit,
        ...(newAvatar !== undefined ? {avatar: newAvatar} : {}),
        ...(bodyFatPercentage !== undefined ? {bodyFatPercentage} : {}),
        ...(muscleMass !== undefined ? {muscleMass} : {}),
        ...(boneMass !== undefined ? {boneMass} : {}),
      });
      setLoading(false);
    } catch (e) {
      setLoading(false);
      logError(e);
      Snackbar.show({text: 'Error updating profile'});
    }
  };

  useEffect(() => {
    getSamplesAction();
  }, [getSamplesAction]);

  const saveDisabled = !dob || equal;

  return (
    <View style={{flex: 1, backgroundColor: colors.appGrey}}>
      <ScrollView
        keyboardShouldPersistTaps="always"
        style={styles.container}
        contentContainerStyle={{paddingBottom: 100}}>
        <LinearGradient
          colors={[colors.appBlueLight, colors.appBlueDark]}
          style={{
            height: 350,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}>
          <SafeAreaView>
            <Header
              hasBack
              title="Profile"
              customBackPress={() => {
                if (equal) {
                  navigation.goBack();
                } else {
                  Alert.alert('Unsaved changes', 'Do you want to save?', [
                    {text: 'Cancel'},
                    {text: 'No', onPress: () => navigation.goBack()},
                    {
                      text: 'Yes',
                      onPress: async () => {
                        await onSave();
                        navigation.goBack();
                      },
                    },
                  ]);
                }
              }}
              right={
                <TouchableOpacity
                  disabled={saveDisabled}
                  onPress={() => {
                    // navigation.navigate('SignUpFlow', {fromProfile: true});
                    onSave();
                  }}>
                  <Text
                    style={{
                      color: colors.appWhite,
                      fontWeight: 'bold',
                      opacity: saveDisabled ? 0.5 : 1,
                    }}>
                    SAVE
                  </Text>
                  {/* <Icon
                    name="edit"
                    size={20}
                    color={colors.appWhite}
                  /> */}
                </TouchableOpacity>
              }
            />
            <View
              style={{
                flexDirection: 'row',
                margin: 20,
                marginBottom: 0,
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  if (profile.premium) {
                    const MAX_SIZE = 500;
                    const cameraOptions: CameraOptions = {
                      mediaType: 'photo',
                      maxHeight: MAX_SIZE,
                      maxWidth: MAX_SIZE,
                    };
                    const imageLibraryOptions: ImageLibraryOptions = {
                      mediaType: 'photo',
                      maxHeight: MAX_SIZE,
                      maxWidth: MAX_SIZE,
                    };
                    Alert.alert('Edit profile photo', '', [
                      {
                        text: 'Upload from image library',
                        onPress: () =>
                          launchImageLibrary(
                            cameraOptions,
                            handlePickerCallback,
                          ),
                      },
                      {
                        text: 'Take photo',
                        onPress: () =>
                          launchCamera(
                            imageLibraryOptions,
                            handlePickerCallback,
                          ),
                      },
                      {
                        text: 'Cancel',
                        style: 'cancel',
                      },
                    ]);
                  } else {
                    navigation.navigate('Premium', {});
                  }
                }}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 45,
                  backgroundColor: colors.appWhite,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 10,
                }}>
                <Avatar
                  name={`${profile.name} ${profile.surname || ''}`}
                  src={avatar}
                  size={80}
                  uid={profile.uid}
                  hideCheck
                />
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    backgroundColor: colors.appWhite,
                    height: 30,
                    width: 30,
                    borderRadius: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Icon
                    size={15}
                    name={profile.premium ? 'pencil-alt' : 'lock'}
                    color={colors.appBlue}
                  />
                </View>
              </TouchableOpacity>
              <View>
                <Text
                  style={{
                    fontSize: 25,
                    fontWeight: 'bold',
                    color: colors.appWhite,
                  }}>
                  {`${profile.name} ${profile.surname || ''}`}
                </Text>
                <Text
                  style={{
                    fontSize: 19,
                    color: colors.appWhite,
                  }}>
                  {moment(dob).format('DD MMM YYYY')}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                marginTop: 20,
              }}>
              <TouchableOpacity onPress={() => setShowWeightModal(true)}>
                <Text
                  style={{
                    fontSize: 30,
                    fontWeight: 'bold',
                    color: colors.appWhite,
                    textAlign: 'center',
                  }}>
                  {weight}
                </Text>
                <Text style={{fontSize: 17, color: colors.appWhite}}>
                  Weight (kg)
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  height: 30,
                  width: 5,
                  backgroundColor: 'rgba(255,255,255,0.5)',
                  borderRadius: 20,
                  alignSelf: 'center',
                }}
              />
              <TouchableOpacity onPress={() => setShowHeightModal(true)}>
                <Text
                  style={{
                    fontSize: 30,
                    fontWeight: 'bold',
                    color: colors.appWhite,
                    textAlign: 'center',
                  }}>
                  {height}
                </Text>
                <Text style={{fontSize: 17, color: colors.appWhite}}>
                  Height (cm)
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* <Animated.View entering={FadeIn.duration(1000)}> */}
        <ProfileCharts
          weight={weight}
          height={height}
          bodyFatPercentage={bodyFatPercentage}
          muscleMass={muscleMass}
          boneMass={boneMass}
          setShowBodyFatPercentageModal={setShowBodyFatPercentageModal}
          setShowBoneMassModal={setShowBoneMassModal}
          setShowMuscleMassModal={setShowMuscleMassModal}
          setShowHeightModal={setShowHeightModal}
          setShowWeightModal={setShowWeightModal}
        />
        {/* </Animated.View> */}
        {/* ) : (
          <View
            style={{
              height: 280,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Spinner />
          </View>
        )} */}
        <Divider style={{marginTop: 20, marginBottom: 10}} />
        <Button
          variant="danger"
          text=" Delete my account"
          style={{margin: 20}}
          onPress={() => navigation.navigate('DeleteAccount')}
        />
      </ScrollView>
      {/* <Button
        text="Save"
        onPress={onSave}
        disabled={saveDisabled}
        style={{
          margin: 10,
          marginBottom: 20,
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
        }}
      /> */}
      <PickerModal
        visible={showHeightModal}
        selectedValue={String(height)}
        pickerData={HEIGHTS.map(value => {
          return {
            label: `${value.toString()} ${unit === 'metric' ? 'cm' : 'inches'}`,
            value: String(value),
          };
        })}
        onValueChange={val => setHeight(Number(val))}
        onRequestClose={() => setShowHeightModal(false)}
      />
      <PickerModal
        visible={showWeightModal}
        selectedValue={String(weight)}
        pickerData={WEIGHTS.map(value => {
          return {
            label: `${value.toString()} ${unit === 'metric' ? 'kg' : 'lbs'}`,
            value: String(value),
          };
        })}
        onValueChange={val => setWeight(Number(val))}
        onRequestClose={() => setShowWeightModal(false)}
      />
      <PickerModal
        visible={showBodyFatPercentageModal}
        selectedValue={String(bodyFatPercentage)}
        pickerData={PERCENTAGES.map(value => {
          return {
            label: `${value.toString()} %`,
            value: String(value),
          };
        })}
        onValueChange={val => setBodyFatPercentage(Number(val))}
        onRequestClose={() => setShowBodyFatPercentageModal(false)}
      />
      <PickerModal
        visible={showMuscleMassModal}
        selectedValue={String(muscleMass)}
        pickerData={MUSCLE_MASSES.map(value => {
          return {
            label: `${value.toString()} ${unit === 'metric' ? 'kg' : 'lbs'}`,
            value: String(value),
          };
        })}
        onValueChange={val => setMuscleMass(Number(val))}
        onRequestClose={() => setShowMuscleMassModal(false)}
      />
      <PickerModal
        visible={showBoneMassModal}
        selectedValue={String(boneMass)}
        pickerData={BONE_DENSITIES.map(value => {
          return {
            label: `${value.toString()} ${unit === 'metric' ? 'kg' : 'lbs'}`,
            value: String(value),
          };
        })}
        onValueChange={val => setBoneMass(Number(val))}
        onRequestClose={() => setShowBoneMassModal(false)}
      />
      <AbsoluteSpinner loading={loading} />
    </View>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

const mapDispatchToProps = {
  updateProfileAction: updateProfile,
  getSamplesAction: getSamples,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileComponent);
