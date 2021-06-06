#!/bin/bash

DSYM=$(find ~/Library/Developer/Xcode/Archives/ -name "*.dSYM")
cd ios
ios/Pods/FirebaseCrashlytics/upload-symbols -gsp ios/HealthAndMovement/GoogleService-Info.plist -p ios $DSYM