import {useEffect, useState} from 'react';
import {ExerciseEvent} from '../types/Shared';
const useExerciseEvents = (index: number) => {
  const [exerciseEvents, setExerciseEvents] = useState<ExerciseEvent[]>([]);
  const [currentIndex, setCurrentIndex] = useState(index);

  useEffect(() => {
    if (currentIndex !== index) {
      setExerciseEvents([
        ...exerciseEvents,
        {value: index + 1, time: new Date()},
      ]);
      setCurrentIndex(index);
    }
  }, [index, currentIndex, setExerciseEvents, exerciseEvents]);
  return {exerciseEvents};
};

export default useExerciseEvents;
