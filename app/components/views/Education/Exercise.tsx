import React, {useMemo} from 'react';
import {connect} from 'react-redux';
import Education, {Category} from '../../../types/Education';
import {MyRootState} from '../../../types/Shared';
import ArticleList from './ArticleList';
import {StackParamList} from '../../../App';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

const Exercise: React.FC<{
  education: {[key: string]: Education};
  navigation: NativeStackNavigationProp<StackParamList, 'Education'>;
}> = ({education, navigation}) => {
  const filtered = useMemo(() => {
    return Object.values(education).filter(
      e => e.category === Category.EXERCISE,
    );
  }, [education]);

  return <ArticleList filtered={filtered} navigation={navigation} />;
};

const mapStateToProps = ({education}: MyRootState) => ({
  education: education.education,
});

export default connect(mapStateToProps)(Exercise);
