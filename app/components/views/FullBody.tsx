import {Layout, Text} from '@ui-kitten/components';
import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {MyRootState} from '../../types/Shared';
import QuickRoutinesListProps from '../../types/views/QuickRoutinesList';
import QuickRoutineList from '../commons/QuickRoutinesList';

const FullBody: React.FC<QuickRoutinesListProps> = ({
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
      routine.area === 'full' &&
      (!focusFilter || focusFilter === routine.focus) &&
      (!equipmentFilter || equipmentFilter === routine.equipment)
    );
  });
  return <QuickRoutineList routines={filtered} navigation={navigation} />;
};

const mapStateToProps = ({quickRoutines}: MyRootState) => ({
  quickRoutines: quickRoutines.quickRoutines,
});

export default connect(mapStateToProps, null)(FullBody);
