#import <React/RCTBridgeModule.h>


@interface RCT_EXTERN_MODULE(WatchWorkoutModule, NSObject)

RCT_EXTERN_METHOD(startWatchApp: resolver:(RCTPromiseResolveBlock *)resolve
                  rejecter:(RCTPromiseRejectBlock *)reject)

@end
