import {Alert, Platform} from 'react-native';
import {takeEvery, call, put, select, takeLatest} from 'redux-saga/effects';
import RNFetchBlob, {FetchBlobResponse} from 'rn-fetch-blob';
import analytics from '@react-native-firebase/analytics';
import {
  DownloadRoutineVideoAction,
  DOWNLOAD_ROUTINE_VIDEO,
  GET_QUICK_ROUTINES,
  SaveQuickRoutineAction,
  SAVE_QUICK_ROUTINE,
  setQuickRoutines,
  setRoutineVideo,
  setRoutineVideoLoading,
} from '../actions/quickRoutines';
import * as api from '../helpers/api';
import QuickRoutine from '../types/QuickRoutines';
import {MyRootState} from '../types/Shared';
import Snackbar from 'react-native-snackbar';

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
    yield call(api.saveQuickRoutine, action.payload);
    yield call(Snackbar.show, {text: 'Quick routine saved '});
  } catch (e) {
    yield call(Snackbar.show, {text: 'Error saving quick routine'});
  }
}

export default function* quickRoutinesSaga() {
  yield takeEvery(GET_QUICK_ROUTINES, getQuickRoutines);
  yield takeLatest(DOWNLOAD_ROUTINE_VIDEO, downloadRoutineVideoWorker);
  yield takeLatest(SAVE_QUICK_ROUTINE, saveQuickRoutine);
}
