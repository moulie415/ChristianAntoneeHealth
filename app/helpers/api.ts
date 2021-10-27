import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import db from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Exercise from '../types/Exercise';
import Profile from '../types/Profile';
import Test from '../types/Test';
import {CardioType, Goal, Level, StrengthArea} from '../types/Shared';
import QuickRoutine from '../types/QuickRoutines';

export const getUser = (user: FirebaseAuthTypes.User) => {
  return db().collection('users').doc(user.uid).get();
};

export const setUser = (user: Profile) => {
  return db().collection('users').doc(user.uid).set(user);
};

export const updateUser = (user: Profile) => {
  return db().collection('users').doc(user.uid).update(user);
};

export const createUser = async (
  email: string,
  password: string,
  extraData: object,
) => {
  const {user} = await auth().createUserWithEmailAndPassword(email, password);
  await db()
    .collection('users')
    .doc(user.uid)
    .set({uid: user.uid, email: user.email, ...extraData});
  if (!user.emailVerified) {
    await user.sendEmailVerification();
  }
};

const getExercisesQuery = (
  level: Level,
  goal: Goal,
  area: StrengthArea,
  cardioType: CardioType,
) => {
  if (goal === Goal.STRENGTH) {
    return db()
      .collection('exercises')
      .where('type', '==', goal)
      .where('area', '==', area)
      .where('level', '==', level)
      .get();
  }
  return db()
    .collection('exercises')
    .where('type', '==', goal)
    .where('cardioType', '==', cardioType)
    .where('level', '==', level)
    .get();
};

export const getExercises = async (
  level: Level,
  goal: Goal,
  area: StrengthArea,
  cardioType: CardioType,
) => {
  const snapshot = await getExercisesQuery(level, goal, area, cardioType);
  return snapshot.docs.reduce((acc: {[id: string]: Exercise}, curr) => {
    const exercise: any = curr.data();
    acc[curr.id] = {...exercise, id: curr.id};
    return acc;
  }, {});
};

export const deleteExercise = (id: string) => {
  return db().collection('exercises').doc(id).delete();
};

export const addExercise = (exercise: Exercise) => {
  return db().collection('exercises').add(exercise);
};

export const updateExercise = (exercise: Exercise) => {
  return db().collection('exercises').doc(exercise.id).update(exercise);
};

export const getTests = async () => {
  const snapshot = await db().collection('tests').get();
  return snapshot.docs.reduce((acc: {[id: string]: Test}, curr) => {
    const test: any = curr.data();
    acc[curr.id] = {...test, id: curr.id};
    return acc;
  }, {});
};

export const getQuickRoutines = async () => {
  const snapshot = await db().collection('quickRoutines').get();
  return snapshot.docs.reduce((acc: {[id: string]: QuickRoutine}, curr) => {
    const quickRoutine: any = curr.data();
    acc[curr.id] = {...quickRoutine, id: curr.id};
    return acc;
  }, {});
};

export const isAdmin = async (uid: string) => {
  const admins = await db().collection('admins').get();
  const keys = admins.docs.map(doc => doc.id);
  return keys.includes(uid);
};
