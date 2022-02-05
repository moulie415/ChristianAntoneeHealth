import {Layout, Text} from '@ui-kitten/components';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {Bar} from 'react-native-progress';
import {connect} from 'react-redux';
import colors from '../../../constants/colors';
import styles from '../../../styles/views/SignUpFlow';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Gender, Unit} from '../../../types/Profile';
import {Goal, MyRootState} from '../../../types/Shared';
import SignUpFlowProps from '../../../types/views/SIgnUpFlow';
import AccountDetails from './AccountDetails';
import FitnessInfo from './FitnessInfo';
import Goals from '../Goals';
import {signUp} from '../../../actions/profile';
import DevicePixels from '../../../helpers/DevicePixels';
import {useBackHandler} from '../../../hooks/UseBackHandler';
import Slider from '../../commons/liquidSwipe/Slider';
import Slide from '../../commons/liquidSwipe/Slide';
import Input from '../../commons/Input';
import moment from 'moment';
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

  const [height, setHeight] = useState<number>(profile.height);
  const [gender, setGender] = useState<Gender>(profile.gender);
  const [workoutFrequency, setWorkoutFrequency] = useState(
    profile.workoutFrequency || 1,
  );
  const [purpose, setPurpose] = useState<Goal>(profile.purpose);
  const [email, setEmail] = useState(profile.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState(profile.name || route.params.name || '');
  const [loading, setLoading] = useState(false);

  const {dry} = route.params;

  useInit(async () => {
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
      workoutFrequency,
      purpose,
      email,
      dry,
      password,
    });
  };

  const slides = [
    {
      color: colors.appBlue,
      showNext: dry
        ? password && confirmPassword && password === confirmPassword
        : !!name,
      elements: (
        <AccountDetails
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
      color: colors.appBlack,
      showNext: !!gender,
      tint: colors.appWhite,
      elements: <SelectSex gender={gender} setGender={setGender} />,
    },
    {
      color: colors.appBlue,
      showNext: !!unit,
      tint: colors.appWhite,
      elements: <SelectUnit unit={unit} setUnit={setUnit} />,
    },

    {
      color: colors.appWhite,
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
      color: colors.appBlack,
      showNext: !!height,
      tint: colors.appWhite,
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
      showNext: !!unit,
      tint: colors.appWhite,
      elements: <SelectGoal />,
    },
    {
      color: colors.appWhite,
      showNext: !!weight,
      elements: <SelectExperience />
    }
  ];

  const [index, setIndex] = useState(0);
  const prev = slides[index - 1];
  const next = slides[index + 1];
  const showNext = slides[index]?.showNext;

  useBackHandler(() => true);

  return (
    <Slider
      key={index}
      index={index}
      setIndex={setIndex}
      current={{slide: slides[index]}}
      prev={prev && <Slide slide={prev} />}
      next={next && showNext && <Slide slide={next} />}>
      <Slide slide={slides[index]!} />
    </Slider>
  );

  // return (
  //   <Layout style={{flex: 1}}>
  //     <LiquidSwipe />
  //     {/* <ScrollView keyboardShouldPersistTaps="always">
  //       <KeyboardAvoidingView
  //         behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
  //         style={{flex: 1}}>
  //         <Image
  //           style={styles.logo}
  //           source={require('../../images/health_and_movement_logo_colour_centred.png')}
  //         />
  //         <Text
  //           category="h4"
  //           style={{textAlign: 'center', marginHorizontal: DevicePixels[10]}}>
  //           Sign up with 3 easy steps
  //         </Text>
  //         <Bar
  //           color={colors.appBlue}
  //           width={DevicePixels[200]}
  //           style={{alignSelf: 'center', marginVertical: DevicePixels[10]}}
  //           progress={(step + 1) / 3}
  //         />
  //         <Text
  //           style={{alignSelf: 'center', marginTop: DevicePixels[10]}}
  //           category="h5">
  //           {getTitle()}
  //         </Text>
  //         {step === 0 && (
  //           <AccountDetails
  //             setStep={setStepAction}
  //             dry={dry}
  //             email={email}
  //             setEmail={setEmail}
  //             name={name}
  //             setName={setName}
  //             password={password}
  //             setPassword={setPassword}
  //             confirmPassword={confirmPassword}
  //             setConfirmPassword={setConfirmPassword}
  //           />
  //         )}
  //         {step === 1 && (
  //           <FitnessInfo
  //             weight={weight}
  //             setWeight={setWeight}
  //             height={height}
  //             setHeight={setHeight}
  //             gender={gender}
  //             setGender={setGender}
  //             dob={dob}
  //             setDob={setDob}
  //             setStep={setStepAction}
  //             unit={unit}
  //             setUnit={setUnit}
  //           />
  //         )}
  //         {step === 2 && (
  //           <Goals
  //             workoutFrequency={workoutFrequency}
  //             setWorkoutFrequency={setWorkoutFrequency}
  //             purpose={purpose}
  //             setPurpose={setPurpose}
  //             signUp={completeSignUp}
  //             loading={loading}
  //           />
  //         )}
  //       </KeyboardAvoidingView>
  //     </ScrollView> */}
  //   </Layout>
  // );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

const mapDispatchToProps = {
  signUp,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpFlow);
