import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  TouchableOpacity,
  Dimensions,
  ScrollView,
  View,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {LineChart} from 'react-native-chart-kit';
import moment from 'moment';
import styles from '../../../styles/views/Profile';
import ProfileProps from '../../../types/views/Profile';
import {connect} from 'react-redux';
import {MyRootState} from '../../../types/Shared';
import {
  IndexPath,
  Input,
  Select,
  SelectItem,
  Text,
  Button,
  Layout,
} from '@ui-kitten/components';
import colors from '../../../constants/colors';
import {Gender, Unit} from '../../../types/Profile';
import {equals} from 'ramda';
import {getSamples, updateProfile} from '../../../actions/profile';
import DatePicker, {Event} from '@react-native-community/datetimepicker';
import {Platform} from 'react-native';
import {getWeightItems} from '../../../helpers';
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

const Profile: React.FC<ProfileProps> = ({
  profile,
  weightSamples,
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
  const [selectedUnitIndex, setSelectedUnitIndex] = useState(
    new IndexPath(profile.unit && profile.unit === 'imperial' ? 1 : 0),
  );
  const [selectedGenderIndex, setSelectedGenderIndex] = useState(
    new IndexPath(gender && gender === 'female' ? 1 : 0),
  );

  const newProfile = {
    ...profile,
    gender,
    weight,
    dob,
    height,
    unit,
    avatar,
  };

  const equal = equals(newProfile, profile);

  const monthlyWeightSamples = weightSamples[moment().month()];
  const weightItems: {
    labels: string[];
    data: number[];
    minMax: number[];
  } = useMemo(() => {
    return getWeightItems(profile, monthlyWeightSamples);
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

  return (
    <Layout style={{flex: 1}}>
      <ScrollView
        keyboardShouldPersistTaps="always"
        style={styles.container}
        contentContainerStyle={{paddingBottom: DevicePixels[100]}}>
        <Layout
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
                      launchImageLibrary(cameraOptions, handlePickerCallback),
                  },
                  {
                    text: 'Take photo',
                    onPress: () =>
                      launchCamera(imageLibraryOptions, handlePickerCallback),
                  },
                ]);
              } else {
                navigation.navigate('Premium');
              }
            }}
            style={{marginRight: DevicePixels[15]}}>
            <Avatar name={profile.name} src={avatar} size={DevicePixels[50]} />
            <View
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: colors.appBlue,
                height: DevicePixels[15],
                width: DevicePixels[15],
                borderRadius: DevicePixels[8],
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon
                size={DevicePixels[8]}
                name={profile.premium ? 'pencil-alt' : 'lock'}
                color="#fff"
              />
            </View>
          </TouchableOpacity>
          <Text category="h5">{profile.name}</Text>
        </Layout>
        <Layout style={{margin: DevicePixels[20]}}>
          <Text style={{color: colors.textGrey, flex: 1}} category="label">
            Date of Birth
          </Text>
          {(show || Platform.OS === 'ios') && (
            <DatePicker
              style={{
                marginVertical: DevicePixels[5],
              }}
              testID="datePicker"
              value={moment(dob).toDate()}
              mode="date"
              display={Platform.OS === 'ios' ? 'compact' : 'default'}
              onChange={(_: Event, d: Date) => {
                if (d) {
                  setDob(d.toISOString());
                }
                setShow(Platform.OS === 'ios');
              }}
            />
          )}
          {Platform.OS === 'android' && (
            <TouchableOpacity
              style={{
                width: '40%',
                marginVertical: DevicePixels[5],
                borderWidth: DevicePixels[1],
                padding: DevicePixels[7],
                borderRadius: DevicePixels[3],
                borderColor: '#ebebeb',
                backgroundColor: '#fafafa',
              }}
              onPress={() => setShow(true)}>
              <Text>{moment(dob).format('DD/MM/YYYY')}</Text>
            </TouchableOpacity>
          )}

          <Select
            style={{width: '65%'}}
            selectedIndex={selectedUnitIndex}
            onSelect={index => {
              setSelectedUnitIndex(index as IndexPath);
              if ('row' in index) {
                setUnit(index.row === 0 ? 'metric' : 'imperial');
              }
            }}
            value={unit || 'Select unit'}
            label="Unit">
            <SelectItem selected={unit === 'metric'} title="metric" />
            <SelectItem selected={unit === 'imperial'} title="imperial" />
          </Select>
          <Input
            value={weight?.toString()}
            returnKeyType="done"
            style={{
              width: '30%',
              marginRight: DevicePixels[20],
              marginTop: DevicePixels[10],
            }}
            onChangeText={val => setWeight(Number(val.replace(/[^0-9]/g, '')))}
            label={`Weight (${unit === 'metric' ? 'kg' : 'lbs'})`}
            keyboardType="numeric"
          />
          <Input
            value={height?.toString()}
            returnKeyType="done"
            style={{
              width: '30%',
              marginRight: DevicePixels[20],
              marginTop: DevicePixels[10],
            }}
            onChangeText={val => setHeight(Number(val.replace(/[^0-9]/g, '')))}
            label={`Height (${unit === 'metric' ? 'cm' : 'inches'})`}
            keyboardType="numeric"
          />

          <Select
            style={{width: '65%', marginBottom: DevicePixels[10]}}
            selectedIndex={selectedGenderIndex}
            onSelect={index => {
              setSelectedGenderIndex(index as IndexPath);
              if ('row' in index) {
                setGender(index.row === 0 ? 'male' : 'female');
              }
            }}
            value={gender || 'Select gender'}
            label="Gender">
            <SelectItem selected={gender === 'male'} title="male" />
            <SelectItem selected={gender === 'female'} title="female" />
          </Select>
        </Layout>
        <Text category="h6" style={{margin: DevicePixels[20], marginTop: 0}}>
          Weight tracking
        </Text>
        <LineChart
          data={weightData}
          width={Dimensions.get('screen').width * 0.9}
          height={DevicePixels[200]}
          chartConfig={weightChartConfig}
          // withVerticalLines={false}
          withShadow={false}
        />
      </ScrollView>
      <Button
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
        }}>
        Save
      </Button>
      <AbsoluteSpinner loading={loading} />
    </Layout>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
  weightSamples: profile.weightSamples,
});

const mapDispatchToProps = {
  updateProfileAction: updateProfile,
  getSamplesAction: getSamples,
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
