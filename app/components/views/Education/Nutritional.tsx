import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useMemo} from 'react';
import {connect} from 'react-redux';
import {StackParamList} from '../../../App';
import Education, {Category} from '../../../types/Education';
import {RootState} from '../../../App';
import ArticleList from './ArticleList';

const Nutritional: React.FC<{
  education: {[key: string]: Education};
  navigation: NativeStackNavigationProp<StackParamList, 'Education'>;
}> = ({education, navigation}) => {
  const filtered = useMemo(() => {
    return Object.values(education).filter(
      e => e.category === Category.NUTRITIONAL,
    );
  }, [education]);

  return <ArticleList filtered={filtered} navigation={navigation} />;
};

const mapStateToProps = ({education}: RootState) => ({
  education: education.education,
});

export default connect(mapStateToProps)(Nutritional);
