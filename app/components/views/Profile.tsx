import DatePicker from '@react-native-community/datetimepicker';
import storage from '@react-native-firebase/storage';
import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as _ from 'lodash';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  AlertButton,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'react-native-compressor';
import RNFS from 'react-native-fs';
import {
  CameraOptions,
  ImageLibraryOptions,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import ImageView from 'react-native-image-viewing';
import { ImageSource } from 'react-native-image-viewing/dist/@types';
import { SafeAreaView } from 'react-native-safe-area-context';
import Snackbar from 'react-native-snackbar';
import { connect } from 'react-redux';
import { RootState, StackParamList } from '../../App';
import {
  BONE_DENSITIES,
  HEIGHTS,
  METABOLIC_AGE_VALUES,
  MUSCLE_MASSES,
  PERCENTAGES,
  VISCERAL_FAT_VALUES,
} from '../../constants';
import colors from '../../constants/colors';
import { logError } from '../../helpers/error';
import { useAppDispatch } from '../../hooks/redux';
import { checkStepsCalories } from '../../reducers/exercises';
import { getSamples, updateProfile } from '../../reducers/profile';
import { SettingsState } from '../../reducers/settings';
import { Gender, Profile, UpdateProfilePayload } from '../../types/Shared';
import Avatar from '../commons/Avatar';
import Button from '../commons/Button';
import GoalSummaries from '../commons/GoalSummaries';
import Header from '../commons/Header';
import HeightModal from '../commons/HeightModal';
import MetricModal from '../commons/MetricModal';
import Modal from '../commons/Modal';
import PickerModal from '../commons/PickerModal';
import ProfileCharts from '../commons/ProfileCharts';
import Text from '../commons/Text';
import Tile from '../commons/Tile';
import WeightModal from '../commons/WeightModal';

const ProfileComponent: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'Profile'>;
  profile: Profile;
  updateProfileAction: (payload: UpdateProfilePayload) => void;
  getSamplesAction: () => void;
  loading: boolean;
  settings: SettingsState;
}> = ({
  profile,
  navigation,
  updateProfileAction,
  getSamplesAction,
  loading: pLoading,
  settings,
}) => {
  const dispatch = useAppDispatch();
  const [gender, setGender] = useState<Gender>(
    (profile.gender as Gender) || null,
  );
  const [weight, setWeight] = useState<number>(profile.weight || 0);
  const [dob, setDob] = useState(profile.dob);
  const [height, setHeight] = useState<number>(profile.height || 0);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [showHeightModal, setShowHeightModal] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showDobModal, setShowDobModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showBodyFatPercentageModal, setShowBodyFatPercentageModal] =
    useState(false);
  const [bodyFatPercentage, setBodyFatPercentage] = useState(
    profile.bodyFatPercentage,
  );

  const [showMuscleMassModal, setShowMuscleMassModal] = useState(false);
  const [muscleMass, setMuscleMass] = useState(profile.muscleMass);

  const [showBoneMassModal, setShowBoneMassModal] = useState(false);
  const [boneMass, setBoneMass] = useState(profile.boneMass);

  const [showVisceralFatModal, setShowVisceralFatModal] = useState(false);
  const [visceralFat, setVisceralFat] = useState(profile.visceralFat);

  const [showMetabolicAgeModal, setShowMetabolicAgeModal] = useState(false);
  const [metabolicAge, setMetabolicAge] = useState(profile.metabolicAge);

  const [images, setImages] = useState<ImageSource[]>([]);
  const [photoVisible, setPhotoVisible] = useState(false);

  const [newProfile, setNewProfile] = useState<Profile>({
    ...profile,
    gender,
    weight,
    dob,
    height,
    ...(avatar !== undefined ? { avatar } : {}),
    ...(bodyFatPercentage !== undefined ? { bodyFatPercentage } : {}),
    ...(muscleMass !== undefined ? { muscleMass } : {}),
    ...(boneMass !== undefined ? { boneMass } : {}),
    ...(visceralFat !== undefined ? { visceralFat } : {}),
    ...(metabolicAge !== undefined ? { metabolicAge } : {}),
  });

  const equal = _.isEqual(newProfile, profile);
  useFocusEffect(() => {
    dispatch(checkStepsCalories());
  });

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

  useEffect(() => {
    setNewProfile({
      ...profile,
      gender,
      weight,
      dob,
      height,
      ...(avatar !== undefined ? { avatar } : {}),
      ...(bodyFatPercentage !== undefined ? { bodyFatPercentage } : {}),
      ...(muscleMass !== undefined ? { muscleMass } : {}),
      ...(boneMass !== undefined ? { boneMass } : {}),
      ...(visceralFat !== undefined ? { visceralFat } : {}),
      ...(metabolicAge !== undefined ? { metabolicAge } : {}),
    });
  }, [
    profile,
    gender,
    weight,
    dob,
    height,
    avatar,
    bodyFatPercentage,
    muscleMass,
    boneMass,
    visceralFat,
    metabolicAge,
  ]);

  const onSave = async () => {
    try {
      setLoading(true);
      let newAvatar = profile.avatar;
      if (avatar !== profile.avatar) {
        const compressed = await Image.compress(avatar || '');
        const read = await RNFS.stat(compressed);

        // file size comes back in bytes so need to divide by 1000000 to get mb
        if (read.size && read.size / 1000000 < settings.chatMaxFileSizeMb) {
          const imageRef = storage()
            .ref(`images/${profile.uid}`)
            .child('avatar');
          await imageRef.putFile(avatar || '');
          newAvatar = await imageRef.getDownloadURL();
        } else {
          throw new Error('File size limit exceeded');
        }
      }
      setAvatar(newAvatar);
      updateProfileAction({
        gender,
        dob,
        height,
        weight,
        ...(newAvatar !== undefined ? { avatar: newAvatar } : {}),
        ...(bodyFatPercentage !== undefined ? { bodyFatPercentage } : {}),
        ...(muscleMass !== undefined ? { muscleMass } : {}),
        ...(boneMass !== undefined ? { boneMass } : {}),
        ...(visceralFat !== undefined ? { visceralFat } : {}),
        ...(metabolicAge !== undefined ? { metabolicAge } : {}),
      });
    } catch (e) {
      logError(e);
      Snackbar.show({ text: 'Error updating profile' });
    }
    setLoading(false);
  };

  useEffect(() => {
    getSamplesAction();
  }, [getSamplesAction]);

  useEffect(() => {
    if (profile.avatar) {
      setImages([{ uri: profile.avatar }]);
    }
  }, [profile.avatar]);

  const saveDisabled = !dob || equal || pLoading || loading;

  return (
    <View style={{ flex: 1, backgroundColor: colors.appGrey }}>
      <SafeAreaView>
        <Header
          left={
            <TouchableOpacity
              disabled={equal || loading || pLoading}
              onPress={() => {
                setAvatar(profile.avatar);
                setWeight(profile.weight || 0);
                setHeight(profile.height || 0);
                setBoneMass(profile.boneMass);
                setMuscleMass(profile.muscleMass);
                setBodyFatPercentage(profile.bodyFatPercentage);
                setDob(profile.dob);
                setVisceralFat(profile.visceralFat);
                setMetabolicAge(profile.metabolicAge);
              }}
            >
              <Text
                style={{
                  color: colors.appWhite,
                  fontWeight: 'bold',
                  opacity: equal ? 0.5 : 1,
                }}
              >
                UNDO
              </Text>
            </TouchableOpacity>
          }
          right={
            <TouchableOpacity
              disabled={saveDisabled}
              onPress={() => {
                onSave();
              }}
            >
              <Text
                style={{
                  color: colors.appWhite,
                  fontWeight: 'bold',
                  opacity: saveDisabled ? 0.5 : 1,
                }}
              >
                SAVE
              </Text>
            </TouchableOpacity>
          }
        />
        <ScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View
            style={{
              marginBottom: 10,
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              onPress={() => {
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
                const options: AlertButton[] = [
                  {
                    text: 'Upload from image library',
                    onPress: () =>
                      launchImageLibrary(cameraOptions, handlePickerCallback),
                  },
                  {
                    text: 'Take photo',
                    onPress: () =>
                      launchCamera(imageLibraryOptions, handlePickerCallback),
                  },
                  {
                    text: 'Cancel',
                    style: 'cancel',
                  },
                ];
                if (profile.avatar) {
                  options.splice(2, 0, {
                    text: 'View photo',
                    onPress: () => setPhotoVisible(true),
                  });
                }
                Alert.alert('Profile photo', '', options);
              }}
              style={{
                width: 95,
                height: 95,
                borderRadius: 48,
                borderColor: colors.appWhite,
                borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
              }}
            >
              <Avatar
                name={`${profile.name} ${profile.surname || ''}`}
                src={avatar}
                size={80}
                hideAdmin
                uid={profile.uid}
              />
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: colors.appWhite,
                  height: 30,
                  width: 30,
                  borderRadius: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FontAwesome6
                  iconStyle="solid"
                  size={15}
                  name="pencil"
                  color={colors.appBlue}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: colors.appWhite,
                textAlign: 'center',
              }}
            >
              {`${profile.name} ${profile.surname || ''}`}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 20,
            }}
          >
            <Tile
              style={{
                width: 100,
                height: 70,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => setShowWeightModal(true)}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: colors.appWhite,
                  textAlign: 'center',
                }}
              >
                {weight}
                <Text style={{ fontSize: 12 }}> kg</Text>
              </Text>
              <Text style={{ fontSize: 12, color: colors.appWhite }}>
                Weight
              </Text>
            </Tile>
            <Tile
              style={{
                width: 100,
                height: 70,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => setShowHeightModal(true)}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: colors.appWhite,
                  textAlign: 'center',
                }}
              >
                {height}
                <Text style={{ fontSize: 12 }}> cm</Text>
              </Text>
              <Text style={{ fontSize: 12, color: colors.appWhite }}>
                Height
              </Text>
            </Tile>
            <Tile
              style={{
                width: 100,
                height: 70,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => setShowDobModal(true)}
            >
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: colors.appWhite,
                  textAlign: 'center',
                }}
              >
                {moment().diff(dob, 'years')}
                <Text style={{ fontSize: 12 }}> y.o</Text>
              </Text>
              <Text style={{ fontSize: 12, color: colors.appWhite }}>Age</Text>
            </Tile>
          </View>

          <GoalSummaries navigation={navigation} />

          <ProfileCharts
            weight={weight}
            height={height}
            bodyFatPercentage={bodyFatPercentage}
            muscleMass={muscleMass}
            boneMass={boneMass}
            visceralFat={visceralFat}
            metabolicAge={metabolicAge}
            setShowBodyFatPercentageModal={setShowBodyFatPercentageModal}
            setShowBoneMassModal={setShowBoneMassModal}
            setShowMuscleMassModal={setShowMuscleMassModal}
            setShowHeightModal={setShowHeightModal}
            setShowWeightModal={setShowWeightModal}
            setShowMetabolicAgeModal={setShowMetabolicAgeModal}
            setShowVisceralFatModal={setShowVisceralFatModal}
          />

          <Button
            variant="danger"
            text=" Delete my account"
            style={{ margin: 20 }}
            onPress={() => navigation.navigate('DeleteAccount')}
          />
        </ScrollView>

        {Platform.OS === 'ios' ? (
          <HeightModal
            visible={showHeightModal}
            onRequestClose={() => setShowHeightModal(false)}
            height={height}
            setHeight={setHeight}
          />
        ) : (
          <PickerModal
            title="Set height"
            visible={showHeightModal}
            selectedValue={String(height)}
            pickerData={HEIGHTS.map(value => {
              return {
                label: `${value.toString()} cm`,
                value: String(value),
              };
            })}
            onValueChange={val => setHeight(Number(val))}
            onRequestClose={() => setShowHeightModal(false)}
          />
        )}

        <WeightModal
          visible={showWeightModal}
          weight={weight}
          setShowWeightModal={setShowWeightModal}
          setWeight={setWeight}
        />

        {Platform.OS === 'ios' ? (
          <MetricModal
            title="Set body fat percentage"
            visible={showBodyFatPercentageModal}
            selectedValue={bodyFatPercentage}
            min={0}
            max={100}
            unit="%"
            onValueChange={setBodyFatPercentage}
            onRequestClose={() => setShowBodyFatPercentageModal(false)}
          />
        ) : (
          <PickerModal
            title="Set body fat percentage"
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
        )}
        {Platform.OS === 'ios' ? (
          <MetricModal
            title="Set muscle mass"
            visible={showMuscleMassModal}
            selectedValue={muscleMass}
            min={0}
            max={100}
            unit="kg"
            onValueChange={val => setMuscleMass(val)}
            onRequestClose={() => setShowMuscleMassModal(false)}
          />
        ) : (
          <PickerModal
            title="Set muscle mass"
            visible={showMuscleMassModal}
            selectedValue={String(muscleMass)}
            pickerData={MUSCLE_MASSES.map(value => {
              return {
                label: `${value.toString()} kg`,
                value: String(value),
              };
            })}
            onValueChange={val => setMuscleMass(Number(val))}
            onRequestClose={() => setShowMuscleMassModal(false)}
          />
        )}
        {Platform.OS === 'ios' ? (
          <MetricModal
            title="Set bone mass"
            visible={showBoneMassModal}
            selectedValue={boneMass}
            min={0}
            max={10}
            unit="kg"
            onValueChange={val => setBoneMass(val)}
            onRequestClose={() => setShowBoneMassModal(false)}
          />
        ) : (
          <PickerModal
            title="Set bone mass"
            visible={showBoneMassModal}
            selectedValue={String(boneMass)}
            pickerData={BONE_DENSITIES.map(value => {
              return {
                label: `${value.toString()} kg`,
                value: String(value),
              };
            })}
            onValueChange={val => setBoneMass(Number(val))}
            onRequestClose={() => setShowBoneMassModal(false)}
          />
        )}
        {Platform.OS === 'ios' ? (
          <MetricModal
            title="Set visceral fat"
            visible={showVisceralFatModal}
            selectedValue={visceralFat}
            min={0}
            max={60}
            onValueChange={val => setVisceralFat(val)}
            onRequestClose={() => setShowVisceralFatModal(false)}
          />
        ) : (
          <PickerModal
            title="Set visceral fat"
            visible={showVisceralFatModal}
            selectedValue={String(visceralFat)}
            pickerData={VISCERAL_FAT_VALUES.map(value => {
              return {
                label: value.toString(),
                value: String(value),
              };
            })}
            onValueChange={val => setVisceralFat(Number(val))}
            onRequestClose={() => setShowVisceralFatModal(false)}
          />
        )}
        {Platform.OS === 'ios' ? (
          <MetricModal
            title="Set metabolic age"
            visible={showMetabolicAgeModal}
            selectedValue={metabolicAge}
            min={0}
            max={100}
            onValueChange={val => setMetabolicAge(val)}
            onRequestClose={() => setShowMetabolicAgeModal(false)}
          />
        ) : (
          <PickerModal
            title="Set metabolic age"
            visible={showMetabolicAgeModal}
            selectedValue={String(metabolicAge)}
            pickerData={METABOLIC_AGE_VALUES.map(value => {
              return {
                label: value.toString(),
                value: String(value),
              };
            })}
            onValueChange={val => setMetabolicAge(Number(val))}
            onRequestClose={() => setShowMetabolicAgeModal(false)}
          />
        )}

        <Modal
          visible={showDobModal && Platform.OS === 'ios'}
          onRequestClose={() => setShowDobModal(false)}
        >
          <View
            style={{
              backgroundColor: colors.appGrey,
              width: '90%',
              alignSelf: 'center',
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                color: colors.appWhite,
                padding: 20,
                paddingBottom: 10,
                fontSize: 20,
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              Select date
            </Text>
            <View style={{ paddingHorizontal: 20 }}>
              <DatePicker
                mode="date"
                textColor={colors.appWhite}
                maximumDate={moment().subtract(18, 'years').toDate()}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                value={moment(dob).toDate()}
                onChange={(event, d: Date | undefined) => {
                  setShowDobModal(true);
                  setDob(d ? d.toISOString() : dob);
                }}
              />
            </View>

            <Button
              text="Close"
              style={{ margin: 10 }}
              onPress={() => setShowDobModal(false)}
            />
          </View>
        </Modal>
        {showDobModal && Platform.OS === 'android' && (
          <DatePicker
            mode="date"
            style={{}}
            textColor={colors.appWhite}
            maximumDate={moment().subtract(18, 'years').toDate()}
            display={'default'}
            value={moment(dob).toDate()}
            onChange={(event, d: Date | undefined) => {
              setShowDobModal(false);
              setDob(d ? d.toISOString() : dob);
            }}
          />
        )}
      </SafeAreaView>
      <ImageView
        images={images}
        imageIndex={0}
        visible={photoVisible}
        onRequestClose={() => setPhotoVisible(false)}
      />
    </View>
  );
};

const mapStateToProps = ({ profile, settings }: RootState) => ({
  profile: profile.profile,
  loading: profile.loading,
  settings,
});

const mapDispatchToProps = {
  updateProfileAction: updateProfile,
  getSamplesAction: getSamples,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileComponent);
