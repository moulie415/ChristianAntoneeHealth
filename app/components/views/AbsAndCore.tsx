import {Layout, Text} from '@ui-kitten/components';
import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {MyRootState} from '../../types/Shared';
import QuickRoutineList from '../commons/QuickRoutineList';
import QuickRoutinesListProps from '../../types/views/QuickRoutinesList';

const AbsAndCore: React.FC<QuickRoutinesListProps> = ({
  route,
  quickRoutines,
}) => {
  // @ts-ignore
  const {area, focus, equipment} = route.params.params;
  console.log(focus, equipment);
  const [focusFilter, setFocusFilter] = useState(focus);
  const [equipmentFilter, setEquipmentFilter] = useState(equipment);

  const filtered = Object.values(quickRoutines).filter(routine => {
    return (
      routine.area === 'core' &&
      (!focusFilter || focusFilter === routine.focus) &&
      (!equipmentFilter || equipmentFilter === routine.equipment)
    );
  });
  return <QuickRoutineList routines={filtered} />;
};

const mapStateToProps = ({quickRoutines}: MyRootState) => ({
  quickRoutines: quickRoutines.quickRoutines,
});

export default connect(mapStateToProps)(AbsAndCore);
