export interface SavedWorkout {
  id?: string;
  workout: string[];
  calories: number;
  seconds: number;
  difficulty: number;
  createddate: number;
}

export interface SavedTest {
  id?: string;
  createddate: number;
  seconds?: number;
  result: number;
  testId: string;
  saved?: boolean;
}

export interface SavedQuickRoutine {
  id?: string;
  calories: number;
  seconds: number;
  difficulty: number;
  createddate: number;
  quickRoutineId: string;
  saved?: boolean;
}
