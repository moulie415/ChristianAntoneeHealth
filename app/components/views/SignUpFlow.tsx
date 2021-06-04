import {Text} from '@ui-kitten/components';
import React, {FunctionComponent, useState} from 'react';
import {Image, KeyboardAvoidingView} from 'react-native';
import {Bar} from 'react-native-progress';
import {connect} from 'react-redux';
import moment from 'moment';
import colors from '../../constants/colors';
import styles from '../../styles/views/SignUpFlow';
import {Gender, HeightMetric, WeightMetric} from '../../types/Profile';
import {Goal, MyRootState, Purpose} from '../../types/Shared';
import SignUpFlowProps from '../../types/views/SIgnUpFlow';
import AccountDetails from './AccountDetails';
import FitnessInfo from './FitnessInfo';
import Goals from './Goals';
import {signUp} from '../../actions/profile';

const SignUpFlow: FunctionComponent<SignUpFlowProps> = ({
  navigation,
  route,
  profile,
  signUp: signUpAction,
}) => {
  const [step, setStep] = useState(0);
  const [dob, setDob] = useState(profile.dob);
  const [weight, setWeight] = useState<number>(profile.weight);
  const [weightMetric, setWeightMetric] = useState<WeightMetric>(
    profile.weightMetric || 'kg',
  );
  const [heightMetric, setHeightMetric] = useState<HeightMetric>(
    profile.heightMetric || 'cm',
  );
  const [height, setHeight] = useState<number>(profile.height);
  const [gender, setGender] = useState<Gender>(profile.gender);
  const [selectedGoals, setSelectedGoals] = useState<Goal[]>(
    profile.goals || [],
  );
  const [workoutFrequency, setWorkoutFrequency] = useState(
    profile.workoutFrequency || 1,
  );
  const [purpose, setPurpose] = useState<Purpose>(profile.purpose);
  const [email, setEmail] = useState(profile.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState(profile.name || '');

  const dry = route.params?.dry;
  const getTitle = () => {
    if (step === 0) {
      return 'Account details';
    }
    if (step === 1) {
      return 'Fitness Info';
    }
    return 'Goals';
  };

  const completeSignUp = () => {
    signUpAction({
      name,
      dob,
      weight,
      weightMetric,
      height,
      heightMetric,
      gender,
      goals: selectedGoals,
      workoutFrequency,
      purpose,
      email,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior="position"
      style={{flex: 1, backgroundColor: colors.appBlack}}>
      <Image
        style={styles.logo}
        source={require('../../images/health_and_movement_logo_colour_centred.png')}
      />
      <Text category="h4" style={{textAlign: 'center'}}>
        Sign up with 3 easy steps
      </Text>
      <Bar
        color={colors.appBlue}
        width={200}
        style={{alignSelf: 'center', marginVertical: 10}}
        progress={(step + 1) / 3}
      />
      <Text style={{alignSelf: 'center', marginTop: 10}} category="h5">
        {getTitle()}
      </Text>
      {step === 0 && (
        <AccountDetails
          setStep={setStep}
          dry={dry}
          email={email}
          setEmail={setEmail}
          name={name}
          setName={setName}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
        />
      )}
      {step === 1 && (
        <FitnessInfo
          weight={weight}
          setWeight={setWeight}
          height={height}
          setHeight={setHeight}
          gender={gender}
          setGender={setGender}
          dob={dob}
          setDob={setDob}
          heightMetric={heightMetric}
          setHeightMetric={setHeightMetric}
          weightMetric={weightMetric}
          setWeightMetric={setWeightMetric}
          setStep={setStep}
        />
      )}
      {step === 2 && (
        <Goals
          selectedGoals={selectedGoals}
          setSelectedGoals={setSelectedGoals}
          workoutFrequency={workoutFrequency}
          setWorkoutFrequency={setWorkoutFrequency}
          purpose={purpose}
          setPurpose={setPurpose}
          signUp={completeSignUp}
        />
      )}
    </KeyboardAvoidingView>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

const mapDispatchToProps = {
  signUp,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpFlow);
