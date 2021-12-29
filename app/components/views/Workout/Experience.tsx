import {Layout, ListItem} from '@ui-kitten/components';
import React, {useState} from 'react';
import {View, SafeAreaView, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {setLevel} from '../../../actions/exercises';
import DevicePixels from '../../../helpers/DevicePixels';
import globalStyles from '../../../styles/globalStyles';
import {Level} from '../../../types/Shared';
import ImageLoader from '../../commons/ImageLoader';
import Text from '../../commons/Text';
import Collapsible from 'react-native-collapsible';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../../App';

const Experience: React.FC<{
  setLevelAction: (level: Level) => void;
  navigation: NativeStackNavigationProp<StackParamList, 'Experience'>;
}> = ({setLevelAction, navigation}) => {
  const [itemsCollapsed, setItemsCollapsed] = useState<{
    [key: number]: boolean;
  }>({
    0: true,
    1: true,
    2: true,
  });
  return (
    <SafeAreaView style={{flex: 1}}>
      <Layout style={{flex: 1}}>
        <TouchableOpacity
          onPress={() => {
            setItemsCollapsed({0: !itemsCollapsed[0], 1: true, 2: true});
          }}
          style={{flex: 1, marginBottom: DevicePixels[5]}}>
          <ImageLoader
            source={require('../../../images/1st_Carousel_image_targeted_workouts.jpeg')}
            overlay
            style={{width: '100%', flex: 1}}
          />

          <View
            style={{
              position: 'absolute',
              bottom: 0,
              top: 0,
              left: DevicePixels[20],
              justifyContent: 'center',
            }}>
            <Text
              category="h5"
              style={[globalStyles.textShadow, {color: '#fff'}]}>
              Beginner
            </Text>
          </View>
        </TouchableOpacity>

        <Collapsible collapsed={itemsCollapsed[0]}>
          <ListItem
            onPress={() => {
              setLevelAction(Level.BEGINNER);
              navigation.goBack();
            }}
            title="Beginner"
            description="If you’re just starting out on your health and fitness journey or
            working through an injury and want to make sure you’re technique is
            right then this is a good place to start"
          />
        </Collapsible>
        <TouchableOpacity
          onPress={() => {
            setItemsCollapsed({0: true, 1: !itemsCollapsed[1], 2: true});
          }}
          style={{flex: 1, marginBottom: DevicePixels[5]}}>
          <ImageLoader
            source={require('../../../images/2nd_carousel_image_fitness_tracking.jpeg')}
            overlay
            style={{width: '100%', flex: 1}}
          />
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              top: 0,
              left: DevicePixels[20],
              justifyContent: 'center',
            }}>
            <Text
              category="h5"
              style={[globalStyles.textShadow, {color: '#fff'}]}>
              Intermediate
            </Text>
          </View>
        </TouchableOpacity>
        <Collapsible collapsed={itemsCollapsed[1]}>
          <ListItem
            onPress={() => {
              setLevelAction(Level.INTERMEDIATE);
              navigation.goBack();
            }}
            title="Intermediate"
            description="For those of you who have been recreationally active for a while and
            have some experience in the gym with weights, but would like a
            little more direction and guidance in structuring your workouts."
          />
        </Collapsible>
        <TouchableOpacity
          onPress={() => {
            setItemsCollapsed({0: true, 1: true, 2: !itemsCollapsed[2]});
          }}
          style={{flex: 1, marginBottom: DevicePixels[5]}}>
          <ImageLoader
            source={require('../../../images/3rd_carousel_image_fitness_testing.jpeg')}
            overlay
            style={{width: '100%', flex: 1}}
          />

          <View
            style={{
              position: 'absolute',
              bottom: 0,
              top: 0,
              left: DevicePixels[20],
              justifyContent: 'center',
            }}>
            <Text
              category="h5"
              style={[globalStyles.textShadow, {color: '#fff'}]}>
              Advanced
            </Text>
          </View>
        </TouchableOpacity>
        <Collapsible collapsed={itemsCollapsed[2]}>
          <ListItem
            onPress={() => {
              setLevelAction(Level.ADVANCED);
              navigation.goBack();
            }}
            title="Advanced"
            description="If you’re a seasoned veteran and want a challenge, then here you’ll
            find a list of exercises that will require you to move in multiple
            planes, transfer power efficiently up and down the body, and use
            your joints and muscles in creative ways."
          />
        </Collapsible>
      </Layout>
    </SafeAreaView>
  );
};

const mapDispatchToProps = {
  setLevelAction: setLevel,
};

export default connect(null, mapDispatchToProps)(Experience);
