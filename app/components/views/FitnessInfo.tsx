import {
  Datepicker,
  Icon,
  IndexPath,
  Input,
  Select,
  SelectItem,
  Button,
} from '@ui-kitten/components';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {View, Alert, Text, Platform} from 'react-native';
import Snackbar from 'react-native-snackbar';
import moment from 'moment';
import {
  getDateOfBirth,
  getHeight,
  getSex,
  getWeight,
  initBiometrics,
  isAvailable,
  linkToGoogleFit,
} from '../../helpers/biometrics';
import FitnessInfoProps from '../../types/views/FitnessInfo';
import AbsoluteSpinner from '../commons/AbsoluteSpinner';

const FitnessInfo: FunctionComponent<FitnessInfoProps> = ({
  height,
  setHeight,
  weight,
  setWeight,
  gender,
  setGender,
  dob,
  setDob,
  heightMetric,
  setHeightMetric,
  weightMetric,
  setWeightMetric,
  setStep,
}) => {
  const init = useCallback(async () => {
    setLoading(true);
    const available = await isAvailable();
    if (!available && Platform.OS === 'android') {
      Alert.alert(
        'Google Fit not installed',
        'While not required we recommend you install Google Fit to get the most out of Health and Movement',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'Install Google Fit', onPress: linkToGoogleFit},
        ],
      );
      setLoading(false);
    } else if (Platform.OS === 'ios') {
      try {
        await initBiometrics();
        const h = await getHeight();
        setHeight(h);
        const w = await getWeight();
        setWeight(w);
        const sex = await getSex();
        setGender(sex);
        const dateOfBirth = await getDateOfBirth();
        if (dateOfBirth) {
          setDob(dateOfBirth);
        }
        setLoading(false);
      } catch (e) {
        setLoading(false);
        Snackbar.show({text: `Error: ${e.message}`});
      }
    }
  }, [setDob, setGender, setHeight, setWeight]);

  useEffect(() => {
    init();
  }, [init]);

  const [selectedGenderIndex, setSelectedGenderIndex] = useState(
    new IndexPath(gender && gender === 'female' ? 1 : 0),
  );
  const [selectedHeightMetricIndex, setSelectedHeightMetricIndex] = useState(
    new IndexPath(heightMetric && heightMetric === 'inches' ? 1 : 0),
  );
  const [selectedWeightMetricIndex, setSelectedWeightMetricIndex] = useState(
    new IndexPath(weightMetric && weightMetric === 'lbs' ? 1 : 0),
  );

  const [loading, setLoading] = useState(false);
  return (
    <View style={{marginHorizontal: 20}}>
      <Datepicker
        style={{width: '65%'}}
        date={moment(dob).toDate()}
        onSelect={date => setDob(date.toISOString())}
        label="Date of Birth"
        max={new Date()}
        min={moment().subtract(200, 'years').toDate()}
        accessoryRight={props => <Icon {...props} name="calendar" />}
      />
      <View style={{flexDirection: 'row'}}>
        <Input
          value={weight?.toString()}
          returnKeyType="done"
          style={{width: '30%', marginRight: 20}}
          onChangeText={val => setWeight(Number(val))}
          label="Weight"
          keyboardType="numeric"
        />
        <Select
          label=" "
          style={{width: '30%'}}
          selectedIndex={selectedWeightMetricIndex}
          onSelect={index => {
            setSelectedWeightMetricIndex(index as IndexPath);
            if ('row' in index) {
              setWeightMetric(index.row === 0 ? 'kg' : 'lbs');
            }
          }}
          value={weightMetric}>
          <SelectItem selected={weightMetric === 'kg'} title="kg" />
          <SelectItem selected={weightMetric === 'lbs'} title="lbs" />
        </Select>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Input
          value={height?.toString()}
          returnKeyType="done"
          style={{width: '30%', marginRight: 20}}
          onChangeText={val => setHeight(Number(val))}
          label="Height"
          keyboardType="numeric"
        />
        <Select
          label=" "
          style={{width: '30%'}}
          selectedIndex={selectedHeightMetricIndex}
          onSelect={index => {
            setSelectedHeightMetricIndex(index as IndexPath);
            if ('row' in index) {
              setHeightMetric(index.row === 0 ? 'cm' : 'inches');
            }
          }}
          value={heightMetric}>
          <SelectItem selected={heightMetric === 'cm'} title="cm" />
          <SelectItem selected={heightMetric === 'inches'} title="inches" />
        </Select>
      </View>
      <Select
        style={{width: '65%'}}
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
      <Text style={{color: '#fff', marginVertical: 20}}>
        This data will help us assess your fitness and exercise requirement. You
        can update this information anytime in your profile.
      </Text>
      <Button
        onPress={() => setStep(2)}
        disabled={!dob || !height || !weight || !gender}>
        Continue
      </Button>
      <AbsoluteSpinner loading={loading} />
    </View>
  );
};

export default FitnessInfo;
