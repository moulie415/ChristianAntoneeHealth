import React, {useState} from 'react';
import {View, useWindowDimensions} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TabBar, TabView} from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/FontAwesome6';
import colors from '../../../constants/colors';
import {useDebouncedEffect} from '../../../hooks/UseDebouncedEffect';
import useThrottle from '../../../hooks/UseThrottle';
import {useAppDispatch, useAppSelector} from '../../../hooks/redux';
import {getLeaderboard} from '../../../reducers/leaderboards';
import {updateProfile} from '../../../reducers/profile';
import Button from '../../commons/Button';
import Header from '../../commons/Header';
import Text from '../../commons/Text';
import Daily from './DailyLeaderboard';
import Ongoing from './OngoingLeaderboard';
import Weekly from './WeeklyLeaderboard';

const Leaderboards = () => {
  const layout = useWindowDimensions();
  const [tabIndex, setTabIndex] = useState(0);

  const [index, setIndex] = useState(0);

  useDebouncedEffect(
    () => {
      fetchLeaderboard();
    },
    [index, tabIndex],
    500,
  );

  const [routes] = useState([
    {key: 'daily', title: 'Daily'},
    {key: 'weekly', title: 'Weekly'},
    {key: 'ongoing', title: 'Ongoing'},
  ]);

  const {profile, loading} = useAppSelector(state => state.profile);

  const {loading: leaderboardsLoading} = useAppSelector(
    state => state.leaderboards,
  );

  const dispatch = useAppDispatch();

  const optIn = useThrottle(() => {
    dispatch(
      updateProfile({disableSnackbar: true, optedInToLeaderboards: true}),
    );
  }, 3000);

  const fetchLeaderboard = () => {
    switch (index) {
      case 0:
        return dispatch(
          getLeaderboard(tabIndex === 0 ? 'dailySteps' : 'dailyCalories'),
        );
      case 1:
        return dispatch(
          getLeaderboard(tabIndex === 0 ? 'weeklySteps' : 'weeklyCalories'),
        );
      case 2:
        return dispatch(getLeaderboard('workoutStreak'));
    }
  };

  const renderScene = ({route}: {route: {key: string}}) => {
    switch (route.key) {
      case 'daily':
        return (
          <Daily
            tabIndex={tabIndex}
            setTabIndex={setTabIndex}
            loading={leaderboardsLoading}
          />
        );
      case 'weekly':
        return (
          <Weekly
            tabIndex={tabIndex}
            setTabIndex={setTabIndex}
            loading={leaderboardsLoading}
          />
        );
      default:
        return <Ongoing loading={leaderboardsLoading} />;
    }
  };
  return (
    <View style={{flex: 1, backgroundColor: colors.appGrey}}>
      <SafeAreaView style={{flex: 1}}>
        <Header showDrawerMenuButton title="Leaderboards" />
        {profile.optedInToLeaderboards ? (
          <TabView
            renderTabBar={p => {
              return (
                <TabBar
                  {...p}
                  renderTabBarItem={props => {
                    return (
                      <TouchableOpacity key={props.key} onPress={props.onPress}>
                        <View
                          style={{
                            height: 45,
                            minWidth: 110,
                            paddingHorizontal: 10,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 12,
                            backgroundColor:
                              props.key === routes[index].key
                                ? colors.appBlue
                                : 'transparent',
                            borderWidth:
                              props.key === routes[index].key ? 0 : 1,
                            borderColor: colors.borderColor,
                            flexDirection: 'row',
                          }}>
                          {props.key === 'ongoing' ? (
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <Icon name="bolt" color={colors.appWhite} />
                              <Text
                                style={{
                                  color: colors.appWhite,
                                  fontWeight: 'bold',
                                  marginLeft: 5,
                                }}>
                                Streak
                              </Text>
                            </View>
                          ) : (
                            <Text
                              style={{
                                fontWeight: 'bold',
                                color: '#fff',
                                textAlign: 'center',
                              }}>
                              {props.route?.title}
                            </Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                  labelStyle={{textTransform: 'none', color: colors.appBlack}}
                  style={{
                    backgroundColor: 'transparent',
                  }}
                  contentContainerStyle={{
                    justifyContent: 'space-evenly',
                  }}
                  indicatorStyle={{backgroundColor: 'transparent'}}
                />
              );
            }}
            lazy
            navigationState={{index, routes}}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{width: layout.width}}
          />
        ) : (
          <View style={{flex: 1}}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: 100,
                  height: 100,
                  backgroundColor: colors.borderColor,
                  borderRadius: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon
                  style={{position: 'absolute'}}
                  name="trophy"
                  color={colors.appBlue}
                  solid
                  size={50}
                />
              </View>
              <Text
                style={{
                  textAlign: 'center',
                  margin: 20,
                  fontSize: 25,
                  fontWeight: 'bold',
                  color: colors.appWhite,
                }}>
                Leaderboards
              </Text>

              <View style={{marginHorizontal: 20, width: 275}}>
                <Text
                  style={{
                    color: colors.offWhite,
                    fontSize: 12,
                    lineHeight: 20,
                    textAlign: 'center',
                  }}>
                  Leaderboards are an optional feature designed for those who
                  are extra competitive. If you'd like to participate, simply
                  press the button below to opt in. Please note that by joining,
                  your avatar, steps, calorie and workout streak data will be
                  visible to other users. You can opt out at any time through
                  the settings screen.
                </Text>
              </View>
            </View>
            <Button
              loading={loading}
              onPress={optIn}
              text="opt in"
              style={{marginHorizontal: 20}}
            />
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

export default Leaderboards;
