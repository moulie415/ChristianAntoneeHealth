#!/bin/bash

DSYM=$(find ~/Library/Developer/Xcode/Archives/ -name "*.dSYM")
echo $DSYM
ls
Pods/FirebaseCrashlytics/upload-symbols -gsp ios/HealthAndMovement/GoogleService-Info.plist -p ios $DSYM