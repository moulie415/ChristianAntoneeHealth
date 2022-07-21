import {Divider, ListItem, Toggle} from '@ui-kitten/components';
import React, {useState} from 'react';
import {View, SafeAreaView, TouchableOpacity} from 'react-native';
import Collapsible from 'react-native-collapsible';
import {connect} from 'react-redux';
import {setCoolDown, setWarmUp} from '../../../actions/exercises';
import DevicePixels from '../../../helpers/DevicePixels';
import globalStyles from '../../../styles/globalStyles';
import {CoolDown, MyRootState, WarmUp} from '../../../types/Shared';
import ImageLoader from '../../commons/ImageLoader';
import Text from '../../commons/Text';

const WarmUpAndCoolDown: React.FC<{
  warmUp: WarmUp[];
  coolDown: CoolDown[];
  setWarmUpAction: (warmUp: WarmUp[]) => void;
  setCoolDownAction: (coolDown: CoolDown[]) => void;
}> = ({warmUp, coolDown, setWarmUpAction, setCoolDownAction}) => {
  const [itemsCollapsed, setItemsCollapsed] = useState<{
    [key: number]: boolean;
  }>({
    0: true,
    1: true,
  });

  const toggleWarmUp = (item: WarmUp) => {
    setWarmUpAction(
      warmUp.includes(item)
        ? warmUp.filter(warmup => warmup !== item)
        : [...warmUp, item],
    );
  };

  const toggleCoolDown = (item: CoolDown) => {
    setCoolDownAction(
      coolDown.includes(item)
        ? coolDown.filter(cooldown => cooldown !== item)
        : [...coolDown, item],
    );
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <TouchableOpacity
          onPress={() => {
            setItemsCollapsed({0: !itemsCollapsed[0], 1: true});
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
            <Text style={[globalStyles.textShadow, {color: '#fff'}]}>
              Warm-up
            </Text>
          </View>
        </TouchableOpacity>
        <Collapsible collapsed={itemsCollapsed[0]}>
          <ListItem
            onPress={() => toggleWarmUp(WarmUp.CIRCULATORY)}
            title="Circulatory Warm-up"
            description="Gradually elevating your heart rate will increase the amount of blood in
            your muscles and fluid in your joints, helping you get the most out of
            your training session. A brisk walk/jog or a light cycle until you’re
            sweating should suffice."
            accessoryRight={() => (
              <Toggle
                checked={warmUp.includes(WarmUp.CIRCULATORY)}
                onChange={checked => toggleWarmUp(WarmUp.CIRCULATORY)}
              />
            )}
          />
          <Divider />
          <ListItem
            onPress={() => toggleWarmUp(WarmUp.SOFT_TISSUE)}
            title="Soft-tissue Preparation"
            description="Applying pressure to the major muscles in the body in the form of a foam
            roller or a similar myofascial release tool will help to soften muscular
            tension and decrease areas of stiffness.."
            accessoryRight={() => (
              <Toggle
                checked={warmUp.includes(WarmUp.SOFT_TISSUE)}
                onChange={checked => toggleWarmUp(WarmUp.SOFT_TISSUE)}
              />
            )}
          />
          <Divider />
          <ListItem
            onPress={() => toggleWarmUp(WarmUp.DYNAMIC_STRETCHING)}
            title="Dynamic Stretching"
            description="Engaging in mobility drills can be a great way to introduce movement to
            muscles, ligaments and joints, and prepare your vascular and nervous
            system to meet the demands of the workout."
            accessoryRight={() => (
              <Toggle
                checked={warmUp.includes(WarmUp.DYNAMIC_STRETCHING)}
                onChange={checked => toggleWarmUp(WarmUp.DYNAMIC_STRETCHING)}
              />
            )}
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
              style={[globalStyles.textShadow, {color: '#fff'}]}>
              Cool-down
            </Text>
          </View>
        </TouchableOpacity>
        <Collapsible collapsed={itemsCollapsed[1]}>
          <ListItem
            onPress={() => toggleCoolDown(CoolDown.CIRCULATORY)}
            title="Circulatory Cool-down"
            description="Engaging in activity similar to a warm-up such as a light walk or cycle
            will help safely bring your heart and breathing rate down to resting
            levels, and will also help to redistribute fluids that have accumulated
            during the workout."
            accessoryRight={() => (
              <Toggle
                checked={coolDown.includes(CoolDown.CIRCULATORY)}
                onChange={checked => toggleCoolDown(CoolDown.CIRCULATORY)}
              />
            )}
          />
          <Divider />
          <ListItem
            onPress={() => toggleCoolDown(CoolDown.STATIC_STRETCHING)}
            title="Static Stretching"
            description="Stretching after a workout can help to give your muscles that loose
            feeling and improve your movement by reducing areas that feel tight and
            restricted.."
            accessoryRight={() => (
              <Toggle
                checked={coolDown.includes(CoolDown.STATIC_STRETCHING)}
                onChange={checked => toggleCoolDown(CoolDown.STATIC_STRETCHING)}
              />
            )}
          />
        </Collapsible>
      </View>
    </SafeAreaView>
  );
};

const mapStateToProps = ({exercises}: MyRootState) => ({
  warmUp: exercises.warmUp,
  coolDown: exercises.coolDown,
});

const mapDispatchToProps = {
  setWarmUpAction: setWarmUp,
  setCoolDownAction: setCoolDown,
};

export default connect(mapStateToProps, mapDispatchToProps)(WarmUpAndCoolDown);
