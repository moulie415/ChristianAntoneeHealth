import React, {MutableRefObject} from 'react';
import {ScrollView, ImageBackground, View} from 'react-native';
import {MyRootState} from '../../../types/Shared';
import {connect} from 'react-redux';
import DevicePixels from '../../../helpers/DevicePixels';
import {SafeAreaView} from 'react-native-safe-area-context';
import TestCard from '../../commons/TestCard';
import colors from '../../../constants/colors';
import Header from '../../commons/Header';
import {StackParamList} from '../../../App';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Test from '../../../types/Test';
import Profile from '../../../types/Profile';
import Drawer from 'react-native-drawer';

const FitnessTesting: React.FC<{
  navigation: NativeStackNavigationProp<StackParamList, 'Fitness'>;
  tests: {[key: string]: Test};
  profile: Profile;
  drawerRef: MutableRefObject<Drawer>;
}> = ({navigation, tests, profile, drawerRef}) => {
  return (
    <View style={{flex: 1, backgroundColor: colors.appGrey}}>
      <SafeAreaView>
        <Header drawerRef={drawerRef} />

        <ScrollView
          contentContainerStyle={{
            paddingBottom: DevicePixels[20],
          }}>
          {Object.values(tests).map((item, index) => {
            return (
              <TestCard
                key={item.id}
                item={item}
                onPress={() => {
                  if (item.premium && !profile.premium) {
                    navigation.navigate('Premium');
                  } else {
                    navigation.navigate('Test', {id: item.id});
                  }
                }}
              />
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const mapStateToProps = ({tests, profile}: MyRootState) => ({
  tests: tests.tests,
  profile: profile.profile,
});

export default connect(mapStateToProps)(FitnessTesting);
