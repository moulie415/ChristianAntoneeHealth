#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(WatchWorkoutModule, NSObject)

RCT_EXTERN_METHOD(startWatchWorkout:(RCTPromiseResolveBlock)resolver
                  rejecter:(RCTPromiseRejectBlock)rejecter)

RCT_EXTERN_METHOD(endWatchWorkout: (NSString *)startDateString resolver: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)


@end
