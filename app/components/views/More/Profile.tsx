import React, {useCallback, useState} from 'react';
import {TouchableOpacity, ScrollView, View, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import styles from '../../../styles/views/Profile';
import ProfileProps from '../../../types/views/Profile';
import {connect} from 'react-redux';
import {MyRootState} from '../../../types/Shared';
import colors from '../../../constants/colors';
import {Gender, Unit} from '../../../types/Profile';
import * as _ from 'lodash';
import {updateProfile} from '../../../actions/profile';
import {
  BONE_DENSITIES,
  HEIGHTS,
  MUSCLE_MASSES,
  PERCENTAGES,
  WEIGHTS,
} from '../../../constants';
import DevicePixels from '../../../helpers/DevicePixels';
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

const Profile: React.FC<ProfileProps> = ({
  profile,
  navigation,
  updateProfileAction,
}) => {
  const [show, setShow] = useState(false);
  const [gender, setGender] = useState<Gender>(profile.gender);
  const [weight, setWeight] = useState<number>(profile.weight);
  const [dob, setDob] = useState(profile.dob);
  const [height, setHeight] = useState<number>(profile.height);
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

  const [showBoneDensityModal, setShowBoneDensityModal] = useState(false);
  const [boneDensity, setBoneDensity] = useState(profile.boneDensity);

  const newProfile = {
    ...profile,
    gender,
    weight,
    dob,
    height,
    unit,
    avatar,
    bodyFatPercentage,
    muscleMass,
    boneDensity,
  };

  const equal = _.isEqual(newProfile, profile);

  const handlePickerCallback = useCallback(
    async (response: ImagePickerResponse) => {
      if (response.errorMessage || response.errorCode) {
        Snackbar.show({
          text: `Error: ${response.errorMessage || response.errorCode}`,
        });
      } else if (!response.didCancel) {
        const image = response.assets[0];
        setAvatar(image.uri);
      }
    },
    [],
  );

  return (
    <View style={{flex: 1, backgroundColor: colors.appGrey}}>
      <ScrollView
        keyboardShouldPersistTaps="always"
        style={styles.container}
        contentContainerStyle={{paddingBottom: DevicePixels[100]}}>
        <LinearGradient
          colors={[colors.appBlueLight, colors.appBlueDark]}
          style={{
            height: DevicePixels[350],
            borderBottomLeftRadius: DevicePixels[20],
            borderBottomRightRadius: DevicePixels[20],
          }}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}>
          <SafeAreaView>
            <Header
              hasBack
              title="Profile"
              // right={
              //   <TouchableOpacity
              //     onPress={() =>
              //       navigation.navigate('SignUpFlow', {fromProfile: true})
              //     }>
              //     <Icon
              //       name="edit"
              //       size={DevicePixels[20]}
              //       color={colors.appWhite}
              //     />
              //   </TouchableOpacity>
              // }
            />
            <View
              style={{
                flexDirection: 'row',
                margin: DevicePixels[20],
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
                    navigation.navigate('Premium');
                  }
                }}
                style={{
                  width: DevicePixels[90],
                  height: DevicePixels[90],
                  borderRadius: DevicePixels[45],
                  backgroundColor: colors.appWhite,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: DevicePixels[10],
                }}>
                <Avatar
                  name={`${profile.name} ${profile.surname || ''}`}
                  src={avatar}
                  size={DevicePixels[80]}
                  uid={profile.uid}
                  hideCheck
                />
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    backgroundColor: colors.appWhite,
                    height: DevicePixels[30],
                    width: DevicePixels[30],
                    borderRadius: DevicePixels[15],
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Icon
                    size={DevicePixels[15]}
                    name={profile.premium ? 'pencil-alt' : 'lock'}
                    color={colors.appBlue}
                  />
                </View>
              </TouchableOpacity>
              <View>
                <Text
                  style={{
                    fontSize: DevicePixels[25],
                    fontWeight: 'bold',
                    color: colors.appWhite,
                  }}>
                  {`${profile.name} ${profile.surname || ''}`}
                </Text>
                <Text
                  style={{
                    fontSize: DevicePixels[19],
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
                marginTop: DevicePixels[20],
              }}>
              <TouchableOpacity onPress={() => setShowWeightModal(true)}>
                <Text
                  style={{
                    fontSize: DevicePixels[30],
                    fontWeight: 'bold',
                    color: colors.appWhite,
                    textAlign: 'center',
                  }}>
                  {weight}
                </Text>
                <Text
                  style={{fontSize: DevicePixels[17], color: colors.appWhite}}>
                  Weight (kg)
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  height: DevicePixels[30],
                  width: DevicePixels[5],
                  backgroundColor: 'rgba(255,255,255,0.5)',
                  borderRadius: DevicePixels[20],
                  alignSelf: 'center',
                }}
              />
              <TouchableOpacity onPress={() => setShowHeightModal(true)}>
                <Text
                  style={{
                    fontSize: DevicePixels[30],
                    fontWeight: 'bold',
                    color: colors.appWhite,
                    textAlign: 'center',
                  }}>
                  {height}
                </Text>
                <Text
                  style={{fontSize: DevicePixels[17], color: colors.appWhite}}>
                  Height (cm)
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <ProfileCharts />
        <Button
          variant="danger"
          text=" Delete my account"
          style={{margin: DevicePixels[20]}}
          onPress={() => navigation.navigate('DeleteAccount')}
        />
      </ScrollView>
      <Button
        text="Save"
        onPress={async () => {
          try {
            setLoading(true);
            let newAvatar = profile.avatar;
            if (avatar !== profile.avatar) {
              const imageRef = storage()
                .ref(`images/${profile.uid}`)
                .child('avatar');
              await imageRef.putFile(avatar);
              newAvatar = await imageRef.getDownloadURL();
            }
            navigation.goBack();
            updateProfileAction({
              gender,
              dob,
              height,
              weight,
              unit,
              avatar: newAvatar,
            });
            setLoading(false);
          } catch (e) {
            setLoading(false);
            logError(e);
            Snackbar.show({text: 'Error updating profile'});
          }
        }}
        disabled={!dob || !height || !weight || !gender || equal}
        style={{
          margin: DevicePixels[10],
          marginBottom: DevicePixels[20],
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
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
        visible={showBoneDensityModal}
        selectedValue={String(boneDensity)}
        pickerData={BONE_DENSITIES.map(value => {
          return {
            label: value.toString(),
            value: String(value),
          };
        })}
        onValueChange={val => setBoneDensity(Number(val))}
        onRequestClose={() => setShowBoneDensityModal(false)}
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
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
