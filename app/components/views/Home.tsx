import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import {Dimensions, ScrollView, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {RootState, StackParamList} from '../../App';
import colors from '../../constants/colors';
import {setHasViewedTargets} from '../../reducers/profile';
import {Goal, Profile} from '../../types/Shared';
import Header from '../commons/Header';
import HomeCard from '../commons/HomeCard';
import TargetModal from './TargetModal';

const {height, width} = Dimensions.get('window');

const RATIO = height / width;

const ROW_MARGIN = 10 * RATIO;

type HomeNavigationProp = NativeStackNavigationProp<StackParamList, 'Home'>;

const Home: React.FC<{
  navigation: HomeNavigationProp;
  hasViewedTargets: boolean;
  setHasViewedTargets: () => void;
  profile: Profile;
}> = ({
  navigation,
  hasViewedTargets,
  setHasViewedTargets: setHasViewedTargetsAction,
  profile,
}) => {
  const [targetModalVisible, setTargetModalVisible] = useState(false);
  useEffect(() => {
    if (!hasViewedTargets && profile.goal && profile.goal !== Goal.OTHER) {
      setTimeout(() => {
        setTargetModalVisible(true);
      }, 500);
    }
  }, [hasViewedTargets, profile.goal]);
  return (
    <View style={{flex: 1, backgroundColor: colors.appGrey}}>
      <SafeAreaView>
        <Header showDrawerMenuButton />
        <ScrollView contentContainerStyle={{paddingBottom: 60}}>
          <FastImage
            source={require('../../images/logo.png')}
            style={{
              width: 95,
              height: 84,
              margin: 40,
              marginTop: 0,
              alignSelf: 'center',
            }}
          />

          <HomeCard
            title="New Workout"
            subtitle="Start a new workout now"
            image={require('../../images/new_workout.jpeg')}
            onPress={() => navigation.navigate('Workout')}
          />

          <HomeCard
            title="Recipes"
            subtitle="Browse a list of recipes"
            image={require('../../images/recipes.jpg')}
            onPress={() => navigation.navigate('RecipeCategories')}
          />

          <HomeCard
            title="Education"
            subtitle="Health and nutrition articles"
            image={require('../../images/Education.jpg')}
            onPress={() => navigation.navigate('Education')}
          />
          <HomeCard
            title="Saved workouts, tests, recipes"
            subtitle="View your saved workouts, tests and recipes"
            image={require('../../images/Saved_workouts.jpg')}
            premium
            onPress={() => navigation.navigate('SavedItems')}
          />
          <HomeCard
            title="Fitness tests"
            subtitle="Track your fitness overtime"
            image={require('../../images/fitness_testing.jpeg')}
            onPress={() => navigation.navigate('Fitness')}
          />

          <HomeCard
            title="Premium"
            subtitle="Explore premium features"
            image={require('../../images/Premium.jpeg')}
            onPress={() => navigation.navigate('Premium', {})}
          />
          <HomeCard
            title="Rate the app"
            subtitle="Let us know what you think"
            image={require('../../images/Rate_the_app.jpeg')}
            onPress={() => navigation.navigate('Rating')}
          />
        </ScrollView>
      </SafeAreaView>
      <TargetModal
        visible={targetModalVisible}
        onRequestClose={() => {
          setTargetModalVisible(false);
          setHasViewedTargetsAction();
        }}
      />
    </View>
  );
};

const mapStateToProps = ({profile}: RootState) => ({
  hasViewedTargets: profile.hasViewedTargets,
  profile: profile.profile,
});

const mapDispatchToProps = {
  setHasViewedTargets,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
