import React, {useState} from 'react';
import {
  Alert,
  Platform,
  Dimensions,
  SafeAreaView,
  View,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import colors from '../../../constants/colors';
import {
  Gender,
  SleepPattern,
  StressLevel,
  TrainingAvailability,
  Unit,
} from '../../../types/Profile';
import {Goal, Level, MyRootState} from '../../../types/Shared';
import SignUpFlowProps from '../../../types/views/SIgnUpFlow';
import AccountDetails from './AccountDetails';
import {signUp} from '../../../actions/profile';
import {useBackHandler} from '../../../hooks/UseBackHandler';
import Slider from '../../commons/liquidSwipe/Slider';
import Slide from '../../commons/liquidSwipe/Slide';
import Age from './Age';
import {
  getDateOfBirth,
  getHeight,
  getSex,
  getWeight,
  initBiometrics,
  isAvailable,
  linkToGoogleFit,
} from '../../../helpers/biometrics';
import {logError} from '../../../helpers/error';
import SelectUnit from './SelectUnit';
import SelectWeight from './SelectWeight';
import SelectSex from './SelectSex';
import useInit from '../../../hooks/UseInit';
import SelectHeight from './SelectHeight';
import SelectGoal from './SelectGoal';
import SelectExperience from './SelectExperience';
import SelectEquipment from './SelectEquipment';
import {Equipment} from '../../../types/QuickRoutines';
import * as Progress from 'react-native-progress';
import CompleteSignUp from './CompleteSignUp';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DevicePixels from '../../../helpers/DevicePixels';
import {resetToWelcome} from '../../../RootNavigation';
import auth from '@react-native-firebase/auth';
import LetsBuild from './LetsBuild';
import Medications from './Medications';
import GeneralLifestyle from './GeneralLifeStyle';
import SleepPatterns from './SleepPatterns';
import StressLevels from './StressLevels';
import Occupation from './Occupation';
import PhysicalInjuries from './PhysicalInjuries';
import SelectTrainingAvailability from './TrainingAvailability';

const {width} = Dimensions.get('window');

const SignUpFlow: React.FC<SignUpFlowProps> = ({
  navigation,
  route,
  profile,
  signUp: signUpAction,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dob, setDob] = useState(profile.dob || new Date().toISOString());
  const [weight, setWeight] = useState<number>(profile.weight);
  const [unit, setUnit] = useState<Unit>(profile.unit || 'metric');
  const [equipment, setEquipment] = useState('');
  const [experience, setExperience] = useState<Level>();
  const [marketing, setMarketing] = useState(false);
  const [height, setHeight] = useState<number>(profile.height);
  const [gender, setGender] = useState<Gender>(profile.gender);
  const [goal, setGoal] = useState<Goal>(profile.goal);
  const [email, setEmail] = useState(profile.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState(profile.name || route.params.name || '');
  const [loading, setLoading] = useState(false);
  const [medications, setMedications] = useState('');
  const [lifestyle, setLifestyle] = useState('');
  const [sleepPattern, setSleepPattern] = useState<SleepPattern>();
  const [stressLevel, setStressLevel] = useState<StressLevel>();
  const [occupation, setOccupation] = useState('');
  const [injuries, setInjuries] = useState('');
  const [
    trainingAvailability,
    setTrainingAvailability,
  ] = useState<TrainingAvailability>();
  const [nutrition, setNutrition] = useState([]);

  const {dry} = route.params;

  useInit(async () => {
    setLoading(true);
    const available = await isAvailable();
    if (!available && Platform.OS === 'android') {
      Alert.alert(
        'Google Fit not installed',
        'While not required we recommend you install Google Fit to get the most out of CA Health',
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
        logError(e);
      }
    }
    setLoading(false);
  });

  const completeSignUp = () => {
    setLoading(true);
    signUpAction({
      name,
      dob,
      weight,
      height,
      unit,
      gender,
      goal,
      email,
      dry,
      password,
      experience,
      equipment,
      marketing,
    });
  };

  const slides = [
    {
      color: colors.appBlue,
      showNext: true,
      elements: <LetsBuild />,
      tint: colors.appWhite,
    },
    {
      color: colors.appBlack,
      showNext: dry
        ? !!password && !!confirmPassword && password === confirmPassword
        : !!name,
      elements: (
        <AccountDetails
          dry={dry}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          name={name}
          setName={setName}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
        />
      ),
      tint: colors.appWhite,
    },
    {
      color: colors.appWhite,
      showNext: !!dob,
      elements: (
        <Age
          dob={dob}
          setDob={setDob}
          setShowDatePicker={setShowDatePicker}
          showDatePicker={showDatePicker}
        />
      ),
    },
    {
      color: colors.appBlue,
      showNext: !!gender,
      tint: colors.appWhite,
      elements: <SelectSex gender={gender} setGender={setGender} />,
    },
    // {
    //   color: colors.appBlue,
    //   showNext: !!unit,
    //   tint: colors.appWhite,
    //   elements: <SelectUnit unit={unit} setUnit={setUnit} />,
    // },

    {
      color: colors.appBlack,
      tint: colors.appWhite,
      showNext: !!weight,
      elements: (
        <SelectWeight
          weight={weight}
          setWeight={setWeight}
          unit={unit}
          gender={gender}
        />
      ),
    },
    {
      color: colors.appWhite,
      showNext: !!height,
      elements: (
        <SelectHeight
          height={height}
          setHeight={setHeight}
          unit={unit}
          gender={gender}
        />
      ),
    },
    {
      color: colors.appBlue,
      tint: colors.appWhite,
      showNext: !!goal,
      elements: <SelectGoal goal={goal} setGoal={setGoal} />,
    },
    {
      color: colors.appBlack,
      tint: colors.appWhite,
      showNext: !!experience,
      elements: (
        <SelectExperience
          experience={experience}
          setExperience={setExperience}
        />
      ),
    },
    {
      color: colors.appWhite,
      showNext: !!equipment,
      tint: colors.appBlue,
      elements: (
        <SelectEquipment equipment={equipment} setEquipment={setEquipment} />
      ),
    },
    {
      color: colors.appBlue,
      tint: colors.appWhite,
      showNext: true,
      elements: (
        <Medications
          medications={medications}
          setMedications={setMedications}
        />
      ),
    },
    {
      color: colors.appBlack,
      tint: colors.appWhite,
      showNext: true,
      elements: (
        <GeneralLifestyle lifestyle={lifestyle} setLifestyle={setLifestyle} />
      ),
    },
    {
      color: colors.appWhite,
      //tint: colors.appWhite,
      showNext: !!sleepPattern,
      elements: (
        <SleepPatterns
          sleepPattern={sleepPattern}
          setSleepPattern={setSleepPattern}
        />
      ),
    },
    {
      color: colors.appBlue,
      tint: colors.appWhite,
      showNext: !!stressLevel,
      elements: (
        <StressLevels
          stressLevel={stressLevel}
          setStressLevel={setStressLevel}
        />
      ),
    },
    {
      color: colors.appBlack,
      elements: (
        <Occupation occupation={occupation} setOccupation={setOccupation} />
      ),
      showNext: true,
    },
    {
      color: colors.appWhite,
      elements: (
        <PhysicalInjuries injuries={injuries} setInjuries={setInjuries} />
      ),
      showNext: true,
    },
    {
      color: colors.appBlue,
      elements: (
        <SelectTrainingAvailability
          trainingAvailability={trainingAvailability}
          setTrainingAvailability={setTrainingAvailability}
        />
      ),
      showNext: !!trainingAvailability,
    },
    {
      color: colors.appBlack,
      elements: (
        
      )
    },
    {
      color: colors.appBlue,
      tint: colors.appWhite,
      showNext: false,
      elements: (
        <CompleteSignUp
          completeSignUp={completeSignUp}
          loading={loading}
          marketing={marketing}
          setMarketing={setMarketing}
        />
      ),
    },
  ];

  const [index, setIndex] = useState(0);
  const prev = slides[index - 1];
  const next = slides[index + 1];
  const showNext = slides[index]?.showNext;

  useBackHandler(() => true);

  return (
    <>
      <SafeAreaView
        style={{flex: 0, backgroundColor: slides[index].tint || colors.appBlue}}
      />
      <SafeAreaView style={{flex: 1}}>
        <Progress.Bar
          width={width}
          progress={(index + 1) / slides.length}
          color={slides[index].tint || colors.appBlue}
          style={{zIndex: 9}}
          borderWidth={0}
          borderRadius={0}
        />
        {index === 0 && (
          <TouchableOpacity
            onPress={() => {
              auth().signOut();
              resetToWelcome();
            }}
            style={{
              zIndex: 200,
              padding: DevicePixels[15],
              width: DevicePixels[50],
            }}>
            <Icon
              name="times"
              color={colors.appWhite}
              style={{fontSize: DevicePixels[20]}}
            />
          </TouchableOpacity>
        )}
        <Slider
          key={index}
          index={index}
          setIndex={setIndex}
          current={{slide: slides[index]}}
          prev={prev && <Slide slide={prev} />}
          next={next && showNext && <Slide slide={next} />}>
          <Slide slide={slides[index]!} />
        </Slider>
      </SafeAreaView>
    </>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

const mapDispatchToProps = {
  signUp,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpFlow);
