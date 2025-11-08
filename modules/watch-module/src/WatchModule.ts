import { NativeModule, requireNativeModule } from 'expo';

import { WatchWorkoutResponse } from './WatchModule.types';

declare class WatchModule extends NativeModule {
  startWatchWorkout(): void;
  endWatchWorkout(): Promise<WatchWorkoutResponse>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<WatchModule>('WatchModule');
