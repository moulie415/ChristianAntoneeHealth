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
  Datepicker,
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
import {Gender, HeightMetric, WeightMetric} from '../../types/Profile';
import {equals} from 'ramda';
import {getSamples, updateProfile} from '../../actions/profile';

const Profile: React.FC<ProfileProps> = ({
  profile,
  weightSamples,
  navigation,
  updateProfileAction,
  getSamplesAction,
}) => {
  const [gender, setGender] = useState<Gender>(profile.gender);
  const [weight, setWeight] = useState<number>(profile.weight);
  const [dob, setDob] = useState(profile.dob);
  const [height, setHeight] = useState<number>(profile.height);
  const [weightMetric, setWeightMetric] = useState<WeightMetric>(
    profile.weightMetric || 'kg',
  );
  const [heightMetric, setHeightMetric] = useState<HeightMetric>(
    profile.heightMetric || 'cm',
  );
  const [selectedGenderIndex, setSelectedGenderIndex] = useState(
    new IndexPath(gender && gender === 'female' ? 1 : 0),
  );
  const [selectedHeightMetricIndex, setSelectedHeightMetricIndex] = useState(
    new IndexPath(heightMetric && heightMetric === 'inches' ? 1 : 0),
  );
  const [selectedWeightMetricIndex, setSelectedWeightMetricIndex] = useState(
    new IndexPath(weightMetric && weightMetric === 'lbs' ? 1 : 0),
  );

  const newProfile = {
    ...profile,
    gender,
    weight,
    dob,
    height,
    weightMetric,
    heightMetric,
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
    color: (opacity = 1) => '#fff',
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
      <ScrollView style={styles.container}>
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
          <Datepicker
            style={{width: '65%', marginBottom: 10}}
            date={moment(dob).toDate()}
            onSelect={date => setDob(date.toISOString())}
            label="Date of Birth"
            max={new Date()}
            min={moment().subtract(200, 'years').toDate()}
            accessoryRight={props => <Icon {...props} name="calendar" />}
          />
          <Layout style={{flexDirection: 'row', marginBottom: 10}}>
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
          </Layout>
          <Layout style={{flexDirection: 'row', marginBottom: 10}}>
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
          </Layout>
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
        <Text category="h6" style={{margin: 20}}>
          Weight tracking
        </Text>
        <LineChart
          data={weightData}
          width={Dimensions.get('screen').width * 0.9}
          height={200}
          chartConfig={chartConfig}
          withVerticalLines={false}
          withShadow={false}
        />
        <Button
          onPress={() => {
            navigation.goBack();
            updateProfileAction({
              gender,
              dob,
              height,
              weight,
              weightMetric,
              heightMetric,
            });
          }}
          disabled={!dob || !height || !weight || !gender || equal}
          style={{margin: 10}}>
          Save
        </Button>
      </ScrollView>
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
