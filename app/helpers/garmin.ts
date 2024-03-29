export interface GarminActivityDetail {
  userId: string;
  summaryId: string;
  activityId: number;
  summary: {
    userId: string;
    summaryId: string;
    activityId: number;
    activityName: string;
    activityDescription: string;
    isParent: boolean;
    parentSummaryId: string;
    durationInSeconds: number;
    startTimeInSeconds: number;
    startTimeOffsetInSeconds: number;
    activityType: string;
    averageBikeCadenceInRoundsPerMinute: number;
    averageHeartRateInBeatsPerMinute: number;
    averageRunCadenceInStepsPerMinute: number;
    averagePushCadenceInStrokesPerMinute: number;
    averageSpeedInMetersPerSecond: number;
    averageSwimCadenceInStrokesPerMinute: number;
    averagePaceInMinutesPerKilometer: number;
    activeKilocalories: number;
    deviceName: string;
    distanceInMeters: number;
    maxBikeCadenceInRoundsPerMinute: number;
    maxHeartRateInBeatsPerMinute: number;
    maxPaceInMinutesPerKilometer: number;
    maxRunCadenceInStepsPerMinute: number;
    maxPushCadenceInStrokesPerMinute: number;
    maxSpeedInMetersPerSecond: number;
    numberOfActiveLengths: number;
    startingLatitudeInDegree: number;
    startingLongitudeInDegree: number;
    steps: number;
    strokes: number;
    totalElevationGainInMeters: number;
    totalElevationLossInMeters: number;
    manual: true;
  };
  samples: {
    startTimeInSeconds: number;
    latitudeInDegree: number;
    longitudeInDegree: number;
    elevationInMeters: number;
    airTemperatureCelcius: number;
    heartRate: number;
    speedMetersPerSecond: number;
    stepsPerMinute: number;
    totalDistanceInMeters: number;
    powerInWatts: number;
    bikeCadenceInRPM: number;
    swimCadenceInStrokesPerMinute: number;
    wheelChairCadenceInStrokesPerMinute: number;
    timerDurationInSeconds: number;
    clockDurationInSeconds: number;
    movingDurationInSeconds: number;
  }[];
  laps: {
    startTimeInSeconds: number;
  }[];
}

