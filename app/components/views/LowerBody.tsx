import {Layout, Text} from '@ui-kitten/components';
import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {MyRootState} from '../../types/Shared';
import QuickRoutinesListProps from '../../types/views/QuickRoutinesList';
import QuickRoutineList from '../commons/QuickRoutineList';

const LowerBody: React.FC<QuickRoutinesListProps> = ({
  route,
  quickRoutines,
}) => {
  // @ts-ignore
  const {area, focus, equipment} = route.params.params;
  const [focusFilter, setFocusFilter] = useState(focus);
  const [equipmentFilter, setEquipmentFilter] = useState(equipment);

  const filtered = Object.values(quickRoutines).filter(routine => {
    return (
      routine.area === 'lower' &&
      (!focusFilter || focusFilter === routine.focus) &&
      (!equipmentFilter || equipmentFilter === routine.equipment)
    );
  });
  return <QuickRoutineList routines={filtered} />;
};

const mapStateToProps = ({quickRoutines}: MyRootState) => ({
  quickRoutines: quickRoutines.quickRoutines,
});

export default connect(mapStateToProps)(LowerBody);
