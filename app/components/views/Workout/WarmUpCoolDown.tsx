import {Divider, ListItem, Text, Toggle} from '@ui-kitten/components';
import React from 'react';
import {View} from 'react-native';
import DevicePixels from '../../../helpers/DevicePixels';
import {CoolDown, WarmUp} from '../../../types/Shared';

const WarmUpCoolDown: React.FC<{
  selectedWarmup: WarmUp[];
  setSelectedWarmUp: (warmUp: WarmUp[]) => void;
  selectedCoolDown: CoolDown[];
  setSelectedCoolDown: (coolDown: CoolDown[]) => void;
}> = ({
  selectedWarmup,
  setSelectedWarmUp,
  selectedCoolDown,
  setSelectedCoolDown,
}) => {
  return (
    <View>
      <Text category="label" style={{margin: DevicePixels[10]}}>
        A thorough warm-up has lots of benefits in preparing you for your
        workout, including an increase in performance and a decreased risk of
        injury, and will also get you ready for more vigorous activity.
      </Text>
      <Divider />
      <ListItem
        title="Circulatory Warm-up"
        onPress={() => {
          setSelectedWarmUp(
            selectedWarmup.includes(WarmUp.CIRCULATORY)
              ? selectedWarmup.filter(warmup => warmup !== WarmUp.CIRCULATORY)
              : [...selectedWarmup, WarmUp.CIRCULATORY],
          );
        }}
        accessoryRight={() => (
          <Toggle
            checked={selectedWarmup.includes(WarmUp.CIRCULATORY)}
            onChange={checked =>
              setSelectedWarmUp(
                checked
                  ? [...selectedWarmup, WarmUp.CIRCULATORY]
                  : selectedWarmup.filter(
                      warmup => warmup !== WarmUp.CIRCULATORY,
                    ),
              )
            }
          />
        )}
      />
      <Divider />
      <Text
        category="label"
        appearance="hint"
        style={{margin: DevicePixels[10]}}>
        Gradually elevating your heart rate will increase the amount of blood in
        your muscles and fluid in your joints, helping you get the most out of
        your training session. A brisk walk/jog or a light cycle until you’re
        sweating should suffice.
      </Text>
      <Divider />
      <ListItem
        title="Soft-tissue Preparation"
        onPress={() => {
          setSelectedWarmUp(
            selectedWarmup.includes(WarmUp.SOFT_TISSUE)
              ? selectedWarmup.filter(warmup => warmup !== WarmUp.SOFT_TISSUE)
              : [...selectedWarmup, WarmUp.SOFT_TISSUE],
          );
        }}
        accessoryRight={() => (
          <Toggle
            checked={selectedWarmup.includes(WarmUp.SOFT_TISSUE)}
            onChange={checked =>
              setSelectedWarmUp(
                checked
                  ? [...selectedWarmup, WarmUp.SOFT_TISSUE]
                  : selectedWarmup.filter(
                      warmup => warmup !== WarmUp.SOFT_TISSUE,
                    ),
              )
            }
          />
        )}
      />
      <Divider />
      <Text
        category="label"
        appearance="hint"
        style={{margin: DevicePixels[10]}}>
        Applying pressure to the major muscles in the body in the form of a foam
        roller or a similar myofascial release tool will help to soften muscular
        tension and decrease areas of stiffness.
      </Text>
      <Divider />
      <ListItem
        title="Dynamic Stretching"
        onPress={() => {
          setSelectedWarmUp(
            selectedWarmup.includes(WarmUp.DYNAMIC_STRETCHING)
              ? selectedWarmup.filter(
                  warmup => warmup !== WarmUp.DYNAMIC_STRETCHING,
                )
              : [...selectedWarmup, WarmUp.DYNAMIC_STRETCHING],
          );
        }}
        accessoryRight={() => (
          <Toggle
            checked={selectedWarmup.includes(WarmUp.DYNAMIC_STRETCHING)}
            onChange={checked =>
              setSelectedWarmUp(
                checked
                  ? [...selectedWarmup, WarmUp.DYNAMIC_STRETCHING]
                  : selectedWarmup.filter(
                      warmup => warmup !== WarmUp.DYNAMIC_STRETCHING,
                    ),
              )
            }
          />
        )}
      />
      <Divider />
      <Text
        category="label"
        appearance="hint"
        style={{margin: DevicePixels[10]}}>
        Engaging in mobility drills can be a great way to introduce movement to
        muscles, ligaments and joints, and prepare your vascular and nervous
        system to meet the demands of the workout.
      </Text>
      <Divider />
      <Text category="h6" style={{margin: 10}}>
        Cool-down Options
      </Text>
      <Divider />
      <ListItem
        title="Circulatory Cool-down"
        onPress={() => {
          setSelectedCoolDown(
            selectedCoolDown.includes(CoolDown.CIRCULATORY)
              ? selectedCoolDown.filter(
                  coolDown => coolDown !== CoolDown.CIRCULATORY,
                )
              : [...selectedCoolDown, CoolDown.CIRCULATORY],
          );
        }}
        accessoryRight={() => (
          <Toggle
            checked={selectedCoolDown.includes(CoolDown.CIRCULATORY)}
            onChange={checked =>
              setSelectedCoolDown(
                checked
                  ? [...selectedCoolDown, CoolDown.CIRCULATORY]
                  : selectedCoolDown.filter(
                      coolDown => coolDown !== CoolDown.CIRCULATORY,
                    ),
              )
            }
          />
        )}
      />
      <Divider />
      <Text
        category="label"
        appearance="hint"
        style={{margin: DevicePixels[10]}}>
        Engaging in activity similar to a warm-up such as a light walk or cycle
        will help safely bring your heart and breathing rate down to resting
        levels, and will also help to redistribute fluids that have accumulated
        during the workout.
      </Text>
      <Divider />
      <ListItem
        title="Static Stretching"
        onPress={() => {
          setSelectedCoolDown(
            selectedCoolDown.includes(CoolDown.STATIC_STRETCHING)
              ? selectedCoolDown.filter(
                  coolDown => coolDown !== CoolDown.STATIC_STRETCHING,
                )
              : [...selectedCoolDown, CoolDown.STATIC_STRETCHING],
          );
        }}
        accessoryRight={() => (
          <Toggle
            checked={selectedCoolDown.includes(CoolDown.STATIC_STRETCHING)}
            onChange={checked =>
              setSelectedCoolDown(
                checked
                  ? [...selectedCoolDown, CoolDown.STATIC_STRETCHING]
                  : selectedCoolDown.filter(
                      coolDown => coolDown !== CoolDown.STATIC_STRETCHING,
                    ),
              )
            }
          />
        )}
      />
      <Divider />
      <Text
        category="label"
        appearance="hint"
        style={{margin: DevicePixels[10]}}>
        Stretching after a workout can help to give your muscles that loose
        feeling and improve your movement by reducing areas that feel tight and
        restricted.
      </Text>
    </View>
  );
};

export default WarmUpCoolDown;
