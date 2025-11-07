export interface Sample {
  startDate: string;
  endDate: string;
  value: number;
}

export interface WatchWorkoutResponse {
  energySamples: Sample[];
  heartRateSamples: Sample[];
}
