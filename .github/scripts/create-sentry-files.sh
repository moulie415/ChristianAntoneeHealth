#!/bin/bash

echo $SENTRY_PROPERTIES >> android/sentry.properties
echo $SENTRY_PROPERTIES >> ios/sentry.properties
cat ios/sentry.properties
ls ios

