import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useMemo} from 'react';
import {connect} from 'react-redux';
import {RootState, StackParamList} from '../../../App';
import Education, {Category} from '../../../types/Education';
import ArticleList from './ArticleList';

const Exercise: React.FC<{
  education: {[key: string]: Education};
  navigation: NativeStackNavigationProp<StackParamList, 'Education'>;
}> = ({education, navigation}) => {
  const filtered = useMemo(() => {
    return Object.values(education).filter(
      e => e.category === Category.EXERCISE,
    ).filter(e => !e.hidden);
  }, [education]);
  return <ArticleList filtered={filtered} navigation={navigation} />;
};

const mapStateToProps = ({education}: RootState) => ({
  education: education.education,
});

export default connect(mapStateToProps)(Exercise);
