#!/bin/bash

cd android/app
echo $GOOGLE_SERVICES_JSON >> google-services.json
echo $KEYSTORE_DATA | base64 --decode > healthandmovement.keystore
cd ..
echo "MYAPP_UPLOAD_KEY_ALIAS=$MYAPP_UPLOAD_KEY_ALIAS" >> gradle.properties
echo "MYAPP_UPLOAD_STORE_FILE=$MYAPP_UPLOAD_STORE_FILE" >> gradle.properties
echo "MYAPP_UPLOAD_STORE_PASSWORD=$MYAPP_UPLOAD_STORE_PASSWORD" >> gradle.properties
echo "MYAPP_UPLOAD_KEY_PASSWORD=$MYAPP_UPLOAD_KEY_PASSWORD" >> gradle.properties
./gradlew bundleRelease