export interface SavedWorkout {
  id?: string;
  workout: string[];
  calories: number;
  seconds: number;
  difficulty: number;
  createddate: Date;
}

export interface SavedTest {
  id?: string;
  createddate: Date;
  seconds?: number;
  result: number;
}

export interface SavedQuickRoutine {
  id?: string;
  calories: number;
  seconds: number;
  difficulty: number;
  createddate: Date;
}
