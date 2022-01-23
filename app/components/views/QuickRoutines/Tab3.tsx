import React, {useMemo} from 'react';
import {connect} from 'react-redux';
import {Goal, MyRootState} from '../../../types/Shared';
import QuickRoutineList from '../../commons/QuickRoutinesList';
import QuickRoutinesListProps from '../../../types/views/QuickRoutinesList';

const Tab3: React.FC<QuickRoutinesListProps> = ({
  route,
  quickRoutines,
  navigation,
}) => {
  // @ts-ignore
  const {key} = route.params;

  const filtered = useMemo(() => {
    return Object.values(quickRoutines).filter(routine => {
      return (
        (key === 'area' && routine.area === 'full') ||
        (key === 'focus' && routine.focus === Goal.WEIGHT) ||
        (key === 'equipment' && routine.equipment === 'none')
      );
    });
  }, [key, quickRoutines]);

  return <QuickRoutineList routines={filtered} navigation={navigation} />;
};

const mapStateToProps = ({quickRoutines}: MyRootState) => ({
  quickRoutines: quickRoutines.quickRoutines,
});

export default connect(mapStateToProps)(Tab3);
