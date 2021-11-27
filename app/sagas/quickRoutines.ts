import {Alert, Platform} from 'react-native';
import {takeEvery, call, put, select, takeLatest} from 'redux-saga/effects';
import RNFetchBlob, {FetchBlobResponse} from 'rn-fetch-blob';
import analytics from '@react-native-firebase/analytics';
import {
  DownloadRoutineVideoAction,
  DOWNLOAD_ROUTINE_VIDEO,
  GetQuickRoutinesByIdAction,
  GET_QUICK_ROUTINES,
  GET_QUICK_ROUTINES_BY_ID,
  GET_SAVED_QUICK_ROUTINES,
  SaveQuickRoutineAction,
  SAVE_QUICK_ROUTINE,
  setQuickRoutines,
  setRoutineVideo,
  setRoutineVideoLoading,
  setSavedQuickRoutine,
} from '../actions/quickRoutines';
import * as api from '../helpers/api';
import QuickRoutine from '../types/QuickRoutines';
import {MyRootState} from '../types/Shared';
import Snackbar from 'react-native-snackbar';
import {SavedQuickRoutine} from '../types/SavedItem';
import {setLoading} from '../actions/exercises';

export function* getQuickRoutines() {
  const tests: {[key: string]: QuickRoutine} = yield call(api.getQuickRoutines);
  yield put(setQuickRoutines(tests));
}

function* downloadRoutineVideoWorker(action: DownloadRoutineVideoAction) {
  const id = action.payload;
  const {quickRoutines, videos} = yield select(
    (state: MyRootState) => state.quickRoutines,
  );
  const quickRoutine: QuickRoutine = quickRoutines[id];
  const video: {src: string; path: string} | undefined = videos[id];
  if (quickRoutine.video) {
    try {
      let exists = true;
      if (video && video.path && Platform.OS === 'ios') {
        exists = yield call(RNFetchBlob.fs.exists, video.path);
      }
      if (!exists && video) {
        const {uid} = yield select(
          (state: MyRootState) => state.profile.profile,
        );
        analytics().logEvent('redownload_routine_video', {
          os: Platform.OS,
          uid,
        });
      }
      if (!video || video.src !== quickRoutine.video.src || !exists) {
        yield put(setRoutineVideoLoading(true));
        const response: FetchBlobResponse = yield call(
          RNFetchBlob.config({
            fileCache: true,
            appendExt: 'mp4',
          }).fetch,
          'GET',
          quickRoutine.video.src,
        );
        yield put(setRoutineVideo(id, quickRoutine.video.src, response.path()));
      }
    } catch (e) {
      yield call(Alert.alert, 'Error', `Error downloading video: ${e.message}`);
    }
  } else {
    yield call(
      Alert.alert,
      'Sorry',
      'Video has not yet been uploaded for this quick routine',
    );
  }
  yield put(setRoutineVideoLoading(false));
}

function* saveQuickRoutine(action: SaveQuickRoutineAction) {
  try {
    const {uid} = yield select((state: MyRootState) => state.profile.profile);
    yield call(api.saveQuickRoutine, action.payload, uid);
    yield call(Snackbar.show, {text: 'Quick routine saved '});
  } catch (e) {
    yield call(Snackbar.show, {text: 'Error saving quick routine'});
  }
}

function* getSavedQuickRoutines() {
  try {
    yield put(setLoading(true));
    const {uid} = yield select((state: MyRootState) => state.profile.profile);
    const savedQuickRoutines: {[key: string]: SavedQuickRoutine} = yield call(
      api.getSavedQuickRoutines,
      uid,
    );
    yield put(setSavedQuickRoutine(savedQuickRoutines));
    yield put(setLoading(false));
  } catch (e) {
    console.log(e);
    yield put(setLoading(false));
    Snackbar.show({text: 'Error getting saved quick routines'});
  }
}

function* getQuickRoutinesById(action: GetQuickRoutinesByIdAction) {
  try {
    const ids = action.payload;
    yield put(setLoading(true));
    if (ids.length) {
      const routines: {[key: string]: QuickRoutine} = yield call(
        api.getQuickRoutinesById,
        ids,
      );
      yield put(setQuickRoutines(routines));
    }
    yield put(setLoading(false));
  } catch (e) {
    console.log(e);
    yield put(setLoading(false));
    Snackbar.show({text: 'Error fetching quick routines'});
  }
}

export default function* quickRoutinesSaga() {
  yield takeEvery(GET_QUICK_ROUTINES, getQuickRoutines);
  yield takeLatest(DOWNLOAD_ROUTINE_VIDEO, downloadRoutineVideoWorker);
  yield takeLatest(SAVE_QUICK_ROUTINE, saveQuickRoutine);
  yield takeLatest(GET_SAVED_QUICK_ROUTINES, getSavedQuickRoutines);
  yield takeLatest(GET_QUICK_ROUTINES_BY_ID, getQuickRoutinesById);
}
