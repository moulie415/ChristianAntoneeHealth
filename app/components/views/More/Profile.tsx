import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  TouchableOpacity,
  Dimensions,
  ScrollView,
  View,
  Alert,
  ImageBackground,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {LineChart} from 'react-native-chart-kit';
import moment from 'moment';
import styles from '../../../styles/views/Profile';
import ProfileProps from '../../../types/views/Profile';
import {connect} from 'react-redux';
import {MyRootState} from '../../../types/Shared';
import colors from '../../../constants/colors';
import {Gender, Unit} from '../../../types/Profile';
import * as _ from 'lodash';
import {getSamples, updateProfile} from '../../../actions/profile';
import DatePicker, {Event} from '@react-native-community/datetimepicker';
import {Platform} from 'react-native';
import {getBMIItems, getWeightItems} from '../../../helpers';
import {weightChartConfig} from '../../../constants';
import {isAvailable, isEnabled} from '../../../helpers/biometrics';
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
import Input from '../../commons/Input';
import Button from '../../commons/Button';
import Header from '../../commons/Header';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import Modal from '../../commons/Modal';
import {Picker} from 'react-native-wheel-pick';

const heights = [...Array(501).keys()];
const weights = [...Array(501).keys()];

const Profile: React.FC<ProfileProps> = ({
  profile,
  weightSamples,
  heightSamples,
  navigation,
  updateProfileAction,
  getSamplesAction,
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

  const newProfile = {
    ...profile,
    gender,
    weight,
    dob,
    height,
    unit,
    avatar,
  };

  const equal = _.isEqual(newProfile, profile);

  const monthlyWeightSamples = weightSamples[moment().month()];
  const monthlyHeightSamples = heightSamples[moment().month()];
  const weightItems: {
    labels: string[];
    data: number[];
    minMax: number[];
  } = useMemo(() => {
    return getBMIItems(profile, monthlyWeightSamples, monthlyHeightSamples);
  }, [monthlyWeightSamples, profile]);

  const weightData = {
    labels: weightItems.labels,
    datasets: [
      {
        data: weightItems.data,
        color: (opacity = 1) => colors.appBlue, // optional
        strokeWidth: 4, // optional
      },
      {
        data: weightItems.minMax,
        color: () => 'rgba(0, 0, 0, 0)',
      },
    ],
  };

  useEffect(() => {
    const init = async () => {
      if (await isEnabled()) {
        getSamplesAction();
      }
    };
    init();
  }, [getSamplesAction]);

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

  const latestBMI = weightItems?.data[weightItems.data.length - 1];

  console.log(latestBMI);

  return (
    <View style={{flex: 1, backgroundColor: '#040404'}}>
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
              right={
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('SignUpFlow', {fromProfile: true})
                  }>
                  <Icon
                    name="edit"
                    size={DevicePixels[20]}
                    color={colors.appWhite}
                  />
                </TouchableOpacity>
              }
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
                  name={profile.name}
                  src={avatar}
                  size={DevicePixels[80]}
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
                  {profile.name}
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

        <Text
          style={{
            margin: DevicePixels[20],
            color: colors.appWhite,
            fontWeight: 'bold',
            fontSize: DevicePixels[24],
          }}>
          BMI tracking
        </Text>
        <LineChart
          data={weightData}
          width={Dimensions.get('screen').width * 0.9}
          height={DevicePixels[200]}
          chartConfig={weightChartConfig}
          // withVerticalLines={false}
          formatYLabel={label => {
            return label.slice(0, -1);
          }}
          withShadow={false}
        />
        <Text
          style={{
            color: colors.appWhite,
            fontSize: DevicePixels[16],
            marginHorizontal: DevicePixels[20],
            marginVertical: DevicePixels[10],
          }}>
          Your current BMI is{' '}
          <Text style={{fontWeight: 'bold'}}>{latestBMI}</Text>
        </Text>

        <Text
          onPress={() =>
            Linking.openURL(
              'https://www.nhs.uk/common-health-questions/lifestyle/what-is-the-body-mass-index-bmi/',
            )
          }
          style={{
            color: colors.appWhite,
            fontWeight: 'bold',
            textDecorationLine: 'underline',
            marginHorizontal: DevicePixels[20],
            marginBottom: DevicePixels[20],
          }}>
          What does this mean?
        </Text>

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
      <Modal
        visible={showHeightModal}
        onRequestClose={() => setShowHeightModal(false)}>
        <View
          style={{
            backgroundColor: '#fff',
            width: '90%',
            alignSelf: 'center',
            borderRadius: DevicePixels[10],
          }}>
          <Picker
            style={{height: DevicePixels[200], backgroundColor: 'transparent'}}
            /* @ts-ignore */
            selectedValue={String(height)}
            pickerData={heights.map(value => {
              return {
                label: `${value.toString()} ${
                  unit === 'metric' ? 'cm' : 'inches'
                }`,
                value: String(value),
              };
            })}
            onValueChange={val => setHeight(Number(val))}
          />
          <Button
            text="Close"
            style={{margin: DevicePixels[10]}}
            onPress={() => setShowHeightModal(false)}
          />
        </View>
      </Modal>
      <Modal
        visible={showWeightModal}
        onRequestClose={() => setShowWeightModal(false)}>
        <View
          style={{
            backgroundColor: '#fff',
            width: '90%',
            alignSelf: 'center',
            borderRadius: DevicePixels[10],
          }}>
          <Picker
            style={{height: DevicePixels[200], backgroundColor: 'transparent'}}
            /* @ts-ignore */
            selectedValue={String(weight)}
            pickerData={weights.map(value => {
              return {
                label: `${value.toString()} ${
                  unit === 'metric' ? 'kg' : 'lbs'
                }`,
                value: String(value),
              };
            })}
            onValueChange={val => setWeight(Number(val))}
          />
          <Button
            text="Close"
            style={{margin: DevicePixels[10]}}
            onPress={() => setShowWeightModal(false)}
          />
        </View>
      </Modal>
      <AbsoluteSpinner loading={loading} />
    </View>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
  weightSamples: profile.weightSamples,
  heightSamples: profile.heightSamples,
});

const mapDispatchToProps = {
  updateProfileAction: updateProfile,
  getSamplesAction: getSamples,
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
