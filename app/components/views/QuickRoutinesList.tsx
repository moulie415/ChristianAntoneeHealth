import {Layout, Text} from '@ui-kitten/components';
import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {getQuickRoutines} from '../../actions/quickRoutines';
import {MyRootState} from '../../types/Shared';
import QuickRoutinesListProps from '../../types/views/QuickRoutinesList';

const QuickRoutinesList: React.FC<QuickRoutinesListProps> = ({
  route,
  quickRoutines,
  getQuickRoutinesAction,
}) => {
  useEffect(() => {
    getQuickRoutinesAction();
  }, [getQuickRoutinesAction]);
  const {area, focus, equipment} = route.params;
  const [areaFilter, setAreaFilter] = useState(area);
  const [focusFilter, setFocusFilter] = useState(focus);
  const [equipmentFilter, setEquipmentFilter] = useState(equipment);

  console.log(quickRoutines);
  const filtered = Object.values(quickRoutines).filter(routine => {
    return (
      (!areaFilter || areaFilter === routine.area) &&
      (!focusFilter || focusFilter === routine.focus) &&
      (!equipmentFilter || equipmentFilter === routine.equipment)
    );
  });
  return (
    <Layout style={{flex: 1}}>
      <Text appearance="hint" style={{padding: 10}}>
        {`${filtered.length} ${filtered.length === 1 ? 'routine' : 'routines'}`}
      </Text>
    </Layout>
  );
};

const mapStateToProps = ({quickRoutines}: MyRootState) => ({
  quickRoutines: quickRoutines.quickRoutines,
});

const mapDispatchToProps = {
  getQuickRoutinesAction: getQuickRoutines,
};

export default connect(mapStateToProps, mapDispatchToProps)(QuickRoutinesList);
