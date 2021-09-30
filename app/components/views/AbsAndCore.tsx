import {Layout, Text} from '@ui-kitten/components';
import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {MyRootState} from '../../types/Shared';
import QuickRoutineList from '../commons/QuickRoutinesList';
import QuickRoutinesListProps from '../../types/views/QuickRoutinesList';

const AbsAndCore: React.FC<QuickRoutinesListProps> = ({
  route,
  quickRoutines,
  navigation,
}) => {
  // @ts-ignore
  const {area, focus, equipment} = route.params.params;
  const [focusFilter, setFocusFilter] = useState(focus);
  const [equipmentFilter, setEquipmentFilter] = useState(equipment);

  const filtered = Object.values(quickRoutines).filter(routine => {
    return (
      routine.area === 'core' &&
      (!focusFilter || focusFilter === routine.focus) &&
      (!equipmentFilter || equipmentFilter === routine.equipment)
    );
  });
  return <QuickRoutineList routines={filtered} navigation={navigation} />;
};

const mapStateToProps = ({quickRoutines}: MyRootState) => ({
  quickRoutines: quickRoutines.quickRoutines,
});

export default connect(mapStateToProps)(AbsAndCore);
