import React, {useEffect, useMemo, useState} from 'react';
import {View, TouchableOpacity, Dimensions, ScrollView} from 'react-native';
import FIcon from 'react-native-vector-icons/FontAwesome5';
import {LineChart} from 'react-native-chart-kit';
import Image from 'react-native-fast-image';
import moment from 'moment';
import styles from '../../styles/views/Profile';
import ProfileProps from '../../types/views/Profile';
import {connect} from 'react-redux';
import {MyRootState} from '../../types/Shared';
import {
  IndexPath,
  Input,
  Icon,
  Select,
  SelectItem,
  Text,
  Button,
  Layout,
} from '@ui-kitten/components';
import colors from '../../constants/colors';
import {Gender, Unit} from '../../types/Profile';
import {equals} from 'ramda';
import {getSamples, updateProfile} from '../../actions/profile';
import DatePicker, {Event} from '@react-native-community/datetimepicker';
import {Platform} from 'react-native';

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
  };

  const equal = equals(newProfile, profile);

  const monthlyWeightSamples = weightSamples[moment().month()];
  const weightItems: {
    labels: string[];
    data: number[];
    minMax: number[];
  } = useMemo(() => {
    const labels = [];
    const data = [];
    let prevWeight;
    let lowest = profile.weight || 0;
    let highest = profile.weight || 0;
    for (let i = 7; i > 0; i--) {
      const day = moment().add(i, 'days');
      const dayOfYear = day.dayOfYear();
      const sample =
        monthlyWeightSamples &&
        monthlyWeightSamples.find(
          s => moment(s.startDate).dayOfYear() === dayOfYear,
        )?.value;
      if (i === 7) {
        const weight = sample || profile.weight || 0;
        if (weight > highest) {
          highest = weight;
        }
        if (weight < lowest) {
          lowest = weight;
        }
        data.push(weight);
        prevWeight = weight;
      } else {
        const weight = sample ?? prevWeight;
        data.push(weight);
        if (weight > highest) {
          highest = weight;
        }
        if (weight < lowest) {
          lowest = weight;
        }
      }
      labels.push(day.format('dd'));
    }

    return {data, labels, minMax: [lowest - 5, highest + 5]};
  }, [monthlyWeightSamples, profile]);
  const weightData = {
    labels: weightItems.labels.reverse(),
    datasets: [
      {
        data: weightItems.data.reverse(),
        color: (opacity = 1) => colors.appBlue, // optional
        strokeWidth: 4, // optional
      },
      {
        data: weightItems.minMax,
        color: () => 'rgba(0, 0, 0, 0)',
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: 'transparent',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: 'transparent',
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => colors.appBlue,
    strokeWidth: 2, // optional, default 3
    useShadowColorFromDataset: false, // optional
    propsForBackgroundLines: {
      strokeWidth: 1,
    },
    barPercentage: 0.7,
  };

  useEffect(() => {
    getSamplesAction();
  }, [getSamplesAction]);

  return (
    <Layout style={{flex: 1}}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{paddingBottom: 100}}>
        <Layout
          style={{flexDirection: 'row', margin: 20, alignItems: 'center'}}>
          <TouchableOpacity style={{marginRight: 20}}>
            {profile.avatar ? (
              <Image style={styles.avatar} source={{uri: profile.avatar}} />
            ) : (
              <TouchableOpacity
                style={{
                  backgroundColor: colors.appGrey,
                  padding: 15,
                  borderRadius: 45,
                }}>
                <FIcon name="user" solid size={25} color="#fff" />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
          <Text category="h5">{profile.name}</Text>
        </Layout>
        <Layout style={{margin: 20}}>
          <Text style={{color: colors.textGrey}} category="label">
            Date of Birth
          </Text>
          {(show || Platform.OS === 'ios') && (
            <DatePicker
              style={{width: '100%', marginVertical: 5}}
              testID="datePicker"
              value={moment(dob).toDate()}
              mode="date"
              display="default"
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
                marginVertical: 5,
                borderWidth: 1,
                padding: 7,
                borderRadius: 3,
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
            style={{width: '30%', marginRight: 20, marginTop: 10}}
            onChangeText={val => setWeight(Number(val))}
            label={`Weight (${unit === 'metric' ? 'kg' : 'lbs'})`}
            keyboardType="numeric"
          />
          <Input
            value={height?.toString()}
            returnKeyType="done"
            style={{width: '30%', marginRight: 20, marginTop: 10}}
            onChangeText={val => setHeight(Number(val))}
            label={`Height (${unit === 'metric' ? 'cm' : 'inches'})`}
            keyboardType="numeric"
          />

          <Select
            style={{width: '65%', marginBottom: 10}}
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
        <Text category="h6" style={{margin: 20, marginTop: 0}}>
          Weight tracking
        </Text>
        <LineChart
          data={weightData}
          width={Dimensions.get('screen').width * 0.9}
          height={200}
          chartConfig={chartConfig}
          // withVerticalLines={false}
          withShadow={false}
        />
      </ScrollView>
      <Button
        onPress={() => {
          navigation.goBack();
          updateProfileAction({
            gender,
            dob,
            height,
            weight,
            unit,
          });
        }}
        disabled={!dob || !height || !weight || !gender || equal}
        style={{
          margin: 10,
          marginBottom: 20,
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
        }}>
        Save
      </Button>
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
