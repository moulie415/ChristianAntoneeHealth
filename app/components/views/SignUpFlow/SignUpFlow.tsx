import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import { Keyboard, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import Snackbar from 'react-native-snackbar';
import StepIndicator from 'react-native-step-indicator';
import { connect } from 'react-redux';
import { RootState, StackParamList } from '../../../App';
import colors from '../../../constants/colors';
import * as api from '../../../helpers/api';
import {
  getDateOfBirth,
  getHeight,
  getSex,
  getWeight,
  initBiometrics,
  isAvailable,
} from '../../../helpers/biometrics';
import { logError } from '../../../helpers/error';
import { useBackHandler } from '../../../hooks/UseBackHandler';
import useInit from '../../../hooks/UseInit';
import useThrottle from '../../../hooks/UseThrottle';
import { LoginFullname, signUp } from '../../../reducers/profile';
import { SettingsState } from '../../../reducers/settings';
import { Area, Equipment } from '../../../types/QuickRoutines';
import {
  CurrentExercise,
  DietaryPreference,
  Gender,
  Goal,
  Level,
  Profile,
  SignUpPayload,
  Sleep,
  StressLevel,
} from '../../../types/Shared';
import Button from '../../commons/Button';
import Header from '../../commons/Header';
import HealthAndLifestyle from './HealthAndLifestyle';
import PersonalDetails from './PersonalDetails';
import SelectArea from './SelectArea';
import SelectEquipment from './SelectEquipment';
import SelectExperience from './SelectExperience';
import SelectGoal from './SelectGoal';
import SelectIsClient from './SelectIsClient';

const SignUpFlow: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'SignUpFlow'>;
  route: RouteProp<StackParamList, 'SignUpFlow'>;
  profile: Profile;
  signUp: (payload: SignUpPayload) => void;
  loginFullname?: LoginFullname;
}> = ({ navigation, route, profile, signUp: signUpAction, loginFullname }) => {
  const fromProfile = route.params?.fromProfile;
  const [name, setName] = useState(profile.name || loginFullname?.name || '');
  const [surname, setSurname] = useState(
    profile.surname || loginFullname?.surname || '',
  );
  const [dob, setDob] = useState(profile.dob || new Date().toISOString());
  const [weight, setWeight] = useState<number>(profile.weight || 0);

  const [marketing, setMarketing] = useState(profile.marketing || false);
  const [height, setHeight] = useState<number>((profile.height as number) || 0);
  const [gender, setGender] = useState<Gender>(
    (profile.gender as Gender) || 'none',
  );
  const [goal, setGoal] = useState<Goal>((profile.goal as Goal) || null);
  const [area, setArea] = useState<Area>((profile.area as Area) || null);
  const [equipment, setEquipment] = useState<Equipment>(
    (profile.equipment as Equipment) || null,
  );
  const [experience, setExperience] = useState<Level>(
    (profile.experience as Level) || null,
  );

  const [equipmentList, setEquipmentList] = useState(
    profile.equipmentList || [],
  );

  const [stressLevel, setStressLevel] = useState<StressLevel>(
    (profile.stressLevel as StressLevel) || null,
  );
  const [sleep, setSleep] = useState((profile.sleep || null) as Sleep);

  const [dietaryPreference, setDietaryPreference] = useState<
    DietaryPreference | string
  >(profile.dietaryPreference || '');

  const [currentExercise, setCurrentExercise] = useState(
    (profile.currentExercise || null) as CurrentExercise,
  );
  const [fitnessRating, setFitnessRating] = useState(
    profile.fitnessRating || 5,
  );

  const [client, setClient] = useState(profile.client || false);
  const [clientCode, setClientCode] = useState('');
  const [clientCodeValid, setClientCodeValid] = useState(false);

  const [loading, setLoading] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [terms, setTerms] = useState(false);

  useInit(() => {
    const setup = async () => {
      setLoading(true);
      const available = await isAvailable();
      if (available) {
        const fetchData = async () => {
          try {
            await initBiometrics();
            const h = await getHeight();
            setHeight(h as number);
            const w = await getWeight();
            setWeight(w as number);
            const sex = await getSex();
            if (sex === 'male' || sex === 'female') {
              setGender(sex);
            }
            const dateOfBirth = await getDateOfBirth();
            if (dateOfBirth) {
              setDob(dateOfBirth);
            }
            setLoading(false);
          } catch (e) {
            setLoading(false);
            logError(e);
          }
        };
        fetchData();
      }
      setLoading(false);
    };
    setup();
  });

  const completeSignUp = useThrottle(() => {
    setLoading(true);
    signUpAction({
      name,
      surname,
      dob,
      weight,
      height,
      gender,
      goal,
      marketing,
      area,
      experience,
      equipment,
      stressLevel,
      sleep,
      dietaryPreference,
      currentExercise,
      fitnessRating,
      client,
      equipmentList,
      fromProfile: !!fromProfile,
    });
  }, 3000);

  const [index, setIndex] = useState(0);

  const ref = useRef<PagerView>(null);

  const goNext = () => ref.current?.setPage(index + 1);
  const goBack = () => ref.current?.setPage(index - 1);

  const onSubmitCode = useThrottle(async (code: string) => {
    setLoading(true);
    const settings = (await api.getSettings()) as SettingsState;
    if (settings.clientCode === code) {
      setClientCodeValid(true);
      goNext();
    } else {
      setClientCodeValid(false);
      Snackbar.show({ text: 'Invalid client code' });
    }
    try {
    } catch (e) {
      if (e instanceof Error) {
        Snackbar.show({ text: 'Error validating client code' });
      }
    }
    setLoading(false);
  }, 3000);

  const slides = [
    {
      key: 'client',
      showNext: !client || clientCodeValid,
      component: (
        <SelectIsClient
          client={client}
          setIsClient={setClient}
          clientCode={clientCode}
          setClientCode={setClientCode}
          onSubmitCode={onSubmitCode}
        />
      ),
    },
    {
      showNext:
        !!name &&
        !!surname &&
        !!dob &&
        moment().diff(dob, 'years') >= 18 &&
        !!height &&
        !!weight &&
        !!privacy &&
        !!terms,
      key: 'name',
      component: (
        <PersonalDetails
          name={name}
          surname={surname}
          setName={setName}
          setSurname={setSurname}
          setDob={setDob}
          dob={dob}
          height={height}
          weight={weight}
          setWeight={setWeight}
          setHeight={setHeight}
          privacy={privacy}
          setPrivacy={setPrivacy}
          terms={terms}
          setTerms={setTerms}
          marketing={marketing}
          setMarketing={setMarketing}
          gender={gender}
          setGender={setGender}
          navigation={navigation}
        />
      ),
    },

    {
      key: 'area',
      showNext: !!area,
      component: <SelectArea area={area} setArea={setArea} />,
    },

    {
      key: 'equipment',
      showNext: !!equipment,
      component: (
        <SelectEquipment
          equipment={equipment}
          setEquipment={setEquipment}
          equipmentList={equipmentList}
          setEquipmentList={setEquipmentList}
        />
      ),
    },
    {
      key: 'experience',
      showNext: !!equipment,
      component: (
        <SelectExperience
          experience={experience}
          setExperience={setExperience}
        />
      ),
    },

    {
      key: 'goal',
      showNext: !!goal,
      component: <SelectGoal goal={goal} setGoal={setGoal} client={client} />,
    },
    {
      key: 'health',
      showNext:
        !!stressLevel &&
        !!sleep &&
        !!dietaryPreference &&
        !!currentExercise &&
        !!fitnessRating,
      component: (
        <HealthAndLifestyle
          stressLevel={stressLevel}
          setStressLevel={setStressLevel}
          sleep={sleep}
          setSleep={setSleep}
          dietaryPreference={dietaryPreference}
          setDietaryPreference={setDietaryPreference}
          currentExercise={currentExercise}
          setCurrentExercise={setCurrentExercise}
          fitnessRating={fitnessRating}
          setFitnessRating={setFitnessRating}
        />
      ),
    },
  ];

  useBackHandler(() => true);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.appGrey }}>
      <View style={{ marginTop: 10 }}>
        <StepIndicator
          stepCount={slides.length}
          currentPosition={index}
          customStyles={{
            stepStrokeCurrentColor: colors.appBlue,
            separatorUnFinishedColor: colors.borderColor,
            separatorFinishedColor: colors.appBlue,
            stepIndicatorUnFinishedColor: colors.borderColor,
            stepIndicatorFinishedColor: colors.appBlue,
            // stepIndicatorSize: 25,
            // currentStepIndicatorSize: 30
          }}
        />
      </View>
      {fromProfile && <Header hasBack />}
      <PagerView
        ref={ref}
        onPageSelected={e => {
          setIndex(e.nativeEvent.position);
          Keyboard.dismiss();
        }}
        removeClippedSubviews={false}
        scrollEnabled={false}
        style={{ flex: 1 }}
      >
        {slides.map((slide, i) => {
          return (
            <View style={{ flex: 1 }} key={slide.key}>
              {slide.component}
              <View
                style={{
                  flexDirection: 'row',
                  position: 'absolute',
                  right: 0,
                  left: 0,
                  bottom: 0,
                  padding: 20,
                  backgroundColor: colors.appGrey,
                }}
              >
                {i !== 0 && (
                  <Button
                    variant="secondary"
                    style={{
                      flex: 1,
                      marginRight: 10,
                    }}
                    onPress={goBack}
                    text="Previous"
                  />
                )}
                {i < slides.length - 1 && (
                  <Button
                    style={{
                      flex: 1,
                      marginLeft: index === 0 ? 0 : 10,
                    }}
                    disabled={!slide.showNext}
                    loading={loading}
                    onPress={goNext}
                    text="Next"
                  />
                )}
                {i === slides.length - 1 && (
                  <Button
                    text="complete"
                    onPress={completeSignUp}
                    disabled={loading || !slide.showNext}
                    loading={loading}
                    style={{
                      flex: 1,
                      marginLeft: 10,
                    }}
                  />
                )}
              </View>
            </View>
          );
        })}
      </PagerView>
    </SafeAreaView>
  );
};

const mapStateToProps = ({ profile }: RootState) => ({
  profile: profile.profile,
  loginFullname: profile.loginFullname,
});

const mapDispatchToProps = {
  signUp,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpFlow);
