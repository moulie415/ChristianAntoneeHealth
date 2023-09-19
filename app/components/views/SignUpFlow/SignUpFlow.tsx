import React, {useRef, useState} from 'react';
import {
  Alert,
  Platform,
  Dimensions,
  SafeAreaView,
  View,
  StyleSheet,
  Keyboard,
} from 'react-native';
import {connect} from 'react-redux';
import colors from '../../../constants/colors';
import Profile, {Gender} from '../../../types/Profile';
import {Goal, Level, MyRootState} from '../../../types/Shared';
import {signUp, SignUpPayload} from '../../../actions/profile';
import {useBackHandler} from '../../../hooks/UseBackHandler';
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
import useInit from '../../../hooks/UseInit';
import SelectGoal from './SelectGoal';
import * as Progress from 'react-native-progress';
import CompleteSignUp from './CompleteSignUp';
import LetsBuild from './LetsBuild';
import BackButton from '../../commons/BackButton';
import ForwardButton from '../../commons/ForwardButton';
import Header from '../../commons/Header';
import FastImage from 'react-native-fast-image';
import Name from './Name';
import Goals from './Goals';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../../App';
import {RouteProp} from '@react-navigation/native';
import SelectWeight from './SelectWeight';
import SelectHeight from './SelectHeight';
import SelectSex from './SelectSex';
import PagerView from 'react-native-pager-view';
import moment from 'moment';
import PersonalDetails from './PersonalDetails';
import Button from '../../commons/Button';

const {width} = Dimensions.get('window');

const SignUpFlow: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'SignUpFlow'>;
  route: RouteProp<StackParamList, 'SignUpFlow'>;
  profile: Profile;
  signUp: (payload: SignUpPayload) => void;
}> = ({navigation, route, profile, signUp: signUpAction}) => {
  const fromProfile = route.params?.fromProfile;
  const [name, setName] = useState(profile.name || '');
  const [surname, setSurname] = useState(profile.surname || '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dob, setDob] = useState(profile.dob || new Date().toISOString());
  const [weight, setWeight] = useState<number>(profile.weight || 0);

  const [marketing, setMarketing] = useState(profile.marketing || false);
  const [height, setHeight] = useState<number>((profile.height as number) || 0);
  const [gender, setGender] = useState<Gender>(
    (profile.gender as Gender) || null,
  );
  const [goal, setGoal] = useState<Goal>((profile.goal as Goal) || null);
  const [loading, setLoading] = useState(false);
  const [privacy, setPrivacy] = useState(false);

  useInit(() => {
    const setup = async () => {
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
      } else if (available) {
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

  const completeSignUp = () => {
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
      fromProfile: !!fromProfile,
    });
  };

  const [index, setIndex] = useState(0);

  const ref = useRef<PagerView>(null);

  const goNext = () => ref.current?.setPage(index + 1);
  const goBack = () => ref.current?.setPage(index - 1);

  const slides = [
    // 1
    {
      showNext:
        !!name &&
        !!surname &&
        !!dob &&
        moment().diff(dob, 'years') >= 18 &&
        !!height &&
        !!weight &&
        !!privacy,
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
          marketing={marketing}
          setMarketing={setMarketing}
          gender={gender}
          setGender={setGender}
        />
      ),
    },
    // 2
    {
      showNext: true,
      key: 'sex',
      component: <SelectSex gender={gender} setGender={setGender} />,
    },
    // 6
    {
      key: 'goal',
      showNext: !!goal,
      component: <SelectGoal goal={goal} setGoal={setGoal} />,
    },

    {
      key: 'goals',
      showNext: true,
      component: <Goals goal={goal} />,
    },
    // 18
    {
      key: 'complete',
      showNext: true,
      component: (
        <CompleteSignUp
          completeSignUp={completeSignUp}
          loading={loading}
          marketing={marketing}
          setMarketing={setMarketing}
        />
      ),
    },
  ];

  useBackHandler(() => true);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.appGrey}}>
      <Progress.Bar
        width={width}
        progress={(index + 1) / slides.length}
        color={colors.appBlue}
        style={{zIndex: 9}}
        borderWidth={0}
        borderRadius={0}
      />
      {fromProfile && <Header hasBack />}
      <PagerView
        ref={ref}
        onPageSelected={e => {
          setIndex(e.nativeEvent.position);
          Keyboard.dismiss();
        }}
        removeClippedSubviews={false}
        scrollEnabled={false}
        style={{flex: 1}}>
        {slides.map((slide, i) => {
          return (
            <View style={{flex: 1}} key={slide.key}>
              {slide.component}
              {i !== 0 && (
                <Button
                  style={{
                    position: 'absolute',
                    right: 20,
                    left: 20,
                    bottom: 90,
                  }}
                  onPress={goBack}
                  text="Previous"
                />
              )}
              {i < slides.length - 1 && (
                <Button
                  style={{
                    position: 'absolute',
                    right: 20,
                    left: 20,
                    bottom: 20,
                  }}
                  disabled={!slide.showNext}
                  onPress={goNext}
                  text="Next"
                />
              )}
            </View>
          );
        })}
      </PagerView>
    </SafeAreaView>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

const mapDispatchToProps = {
  signUp,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpFlow);
