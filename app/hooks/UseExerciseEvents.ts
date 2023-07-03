import {useState, useEffect} from 'react';
import {ExerciseEvent} from '../types/Shared';
const useExerciseEvents = (index: number, seconds: number) => {
  const [exerciseEvents, setExerciseEvents] = useState<ExerciseEvent[]>([]);
  const [currentIndex, setCurrentIndex] = useState(index);

  useEffect(() => {
    if (currentIndex !== index) {
      setExerciseEvents([...exerciseEvents, {value: index + 1, seconds}]);
      setCurrentIndex(index);
    }
  }, [index, currentIndex, setExerciseEvents, exerciseEvents, seconds]);
  return {exerciseEvents};
};

export default useExerciseEvents;
