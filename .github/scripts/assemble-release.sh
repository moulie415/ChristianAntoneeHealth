#!/bin/bash

cd android/app
echo $GOOGLE_SERVICES_JSON >> google-services.json
cd ..
./gradlew assembleRelease