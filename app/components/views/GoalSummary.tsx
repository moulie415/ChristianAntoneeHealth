import React, {useEffect} from 'react';
import {Goal, MyRootState} from '../../types/Shared';
import Profile from '../../types/Profile';
import {connect} from 'react-redux';
import {setViewedSummary} from '../../actions/profile';
import {Layout} from '@ui-kitten/components';
import Text from '../commons/Text';

const GoalSummary: React.FC<{
  profile: Profile;
  setViewedSummary: () => void;
}> = ({profile, setViewedSummary: setViewed}) => {
  useEffect(() => {
    setViewed();
  }, [setViewed]);

  const getTitle = () => {
    const {goal} = profile;
    if (goal === Goal.BONE_DENSITY) {
      return 'Lets make your bones stronger!';
    }
    if (goal === Goal.CORE) {
      return 'Lets get your core slim and strong!';
    }
    return 'Lets keep you strong and lean!';
  };
  return (
    <Layout>
      <Text category="h4">{getTitle()}</Text>
    </Layout>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

const mapDispatchToProps = {
  setViewedSummary,
};

export default connect(mapStateToProps, mapDispatchToProps)(GoalSummary);
