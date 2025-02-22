import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect, useMemo} from 'react';
import {connect} from 'react-redux';
import {RootState, StackParamList} from '../../../App';
import {getEducation} from '../../../reducers/education';
import Education, {Category} from '../../../types/Education';
import ArticleList from './ArticleList';

const General: React.FC<{
  education: {[key: string]: Education};
  getEducationAction: () => void;
  navigation: NativeStackNavigationProp<StackParamList, 'Education'>;
}> = ({education, getEducationAction, navigation}) => {
  useEffect(() => {
    getEducationAction();
  }, [getEducationAction]);
  const filtered = useMemo(() => {
    return Object.values(education).filter(
      e => e.category === Category.GENERAL,
    ).filter(e => !e.hidden);
  }, [education]);

  return <ArticleList filtered={filtered} navigation={navigation} />;
};

const mapStateToProps = ({education}: RootState) => ({
  education: education.education,
});

const mapDispatchToProp = {
  getEducationAction: getEducation,
};

export default connect(mapStateToProps, mapDispatchToProp)(General);
