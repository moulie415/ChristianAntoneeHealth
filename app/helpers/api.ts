import {FirebaseAuthTypes} from '@react-native-firebase/auth';
import db from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Exercise from '../types/Exercise';
import Profile from '../types/Profile';
import Test from '../types/Test';
import {Goal, Level, StrengthArea} from '../types/Shared';

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

const getExercisesQuery = (level: Level, goals: Goal[], area: StrengthArea) => {
  if (goals.includes(Goal.FLEXIBILITY)) {
    return db().collection('exercises').where('type', 'in', goals).get();
  }
  if (goals.includes(Goal.BALANCE) || goals.includes(Goal.CARDIO)) {
    return db()
      .collection('exercises')
      .where('level', '==', level)
      .where('type', 'in', goals)
      .get();
  }
  return db()
    .collection('exercises')
    .where('level', '==', level)
    .where('type', 'in', goals)
    .where('area', '==', area)
    .get();
};

export const getExercises = async (
  level: Level,
  goals: Goal[],
  area: StrengthArea,
) => {
  const snapshot = await getExercisesQuery(level, goals, area);
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
