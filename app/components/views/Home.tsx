import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {Dimensions, ScrollView, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {SafeAreaView} from 'react-native-safe-area-context';
import {connect} from 'react-redux';
import {StackParamList} from '../../App';
import colors from '../../constants/colors';
import Profile from '../../types/Profile';
import {MyRootState} from '../../types/Shared';
import Header from '../commons/Header';
import HomeCard from '../commons/HomeCard';

const {height, width} = Dimensions.get('window');

const RATIO = height / width;

const ROW_MARGIN = 10 * RATIO;

type HomeNavigationProp = NativeStackNavigationProp<StackParamList, 'Home'>;

const Home: React.FC<{
  navigation: HomeNavigationProp;
  profile: Profile;
}> = ({navigation, profile}) => {
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

          {/* <Text
            style={{
              marginLeft: 20,
              fontSize: 14,
              color: colors.appWhite,
              fontWeight: 'bold',
            }}>
            {`${greetingMessage()},`}
          </Text> */}
          {/* <Text
            style={{
              marginLeft: 20,
              marginBottom: 20,
              fontSize: 30,
              color: colors.appWhite,
              fontWeight: 'bold',
            }}>
            {profile.name?.split(' ')[0] || 'user'}
          </Text> */}

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
    </View>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(Home);
