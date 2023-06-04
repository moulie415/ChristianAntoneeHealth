#!/bin/bash

ls
DSYM=$(find ios -name "*.dSYM")
echo $DSYM
ls
sentry-cli --auth-token $SENTRY_TOKEN upload-dif --org henry-moule --project health-and-movement $DSYM
# ios/Pods/FirebaseCrashlytics/upload-symbols -gsp ios/HealthAndMovement/GoogleService-Info.plist -p ios $DSYM