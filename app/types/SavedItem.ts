export interface SavedWorkout {
  id: string;
  workout: string[];
  createddate: Date;
}

export interface SavedTest {
  id: string;
  createddate: Date;
  time?: number;
  result: number;
}

export interface SavedQuickRoutine {
  id: string;
  time: number;
  createddate: Date;
}
