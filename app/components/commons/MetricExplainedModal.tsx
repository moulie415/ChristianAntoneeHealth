import {View} from 'react-native';
import React from 'react';
import Modal from './Modal';
import Button from './Button';

import colors from '../../constants/colors';
import Text from './Text';
import * as _ from 'lodash';

const MetricExplainedModal: React.FC<{
  visible: boolean;
  onRequestClose: () => void;
  suffix?: string;
  ranges: number[];
  colors: string[];
  labels: string[];
  current?: number;
  title: string;
}> = ({
  visible,
  onRequestClose,
  ranges,
  colors: colorsArr,
  title,
  labels,
  current,
  suffix,
}) => {
  if (!current) {
    return null;
  }
  return (
    <Modal visible={visible} onRequestClose={onRequestClose}>
      {visible && (
        <View
          style={{
            backgroundColor: colors.appGrey,
            width: '100%',
            alignSelf: 'center',
            borderRadius: 10,
          }}>
          <Text
            style={{
              textAlign: 'center',
              padding: 15,
              fontSize: 25,
              color: colors.appWhite,
              fontWeight: 'bold',
            }}>
            {title}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              marginHorizontal: 10,
              marginBottom: 20,
            }}>
            {!!colorsArr.length &&
              !!ranges.length &&
              colorsArr.map((color, index) => {
                const isFirst = index === 0;
                const isLast = index === colorsArr.length - 1;
                const currentRange = ranges[index];
                const nextRange = ranges[index + 1];
                const isInRange =
                  (current >= currentRange && current < nextRange) ||
                  (isLast && current > nextRange);

                const diff = nextRange - currentRange;
                const val = current - currentRange;
                const percentage = _.clamp((val / diff) * 100, 100);
                return (
                  <View key={color} style={{flex: 1}}>
                    <Text
                      style={{
                        textAlign: 'left',
                        color: colors.appWhite,
                        marginLeft: -10,
                        height: 23,
                      }}>
                      {isFirst
                        ? ''
                        : `${ranges[index] + (suffix as string) || ''}`}
                    </Text>
                    <View
                      style={{
                        backgroundColor: color,
                        height: 7,
                        justifyContent: 'center',
                      }}>
                      {isInRange && (
                        <View
                          style={{
                            height: 15,
                            width: 15,
                            backgroundColor: colors.appWhite,
                            borderRadius: 8,
                            left: `${percentage}%`,
                            marginLeft: -8,
                            borderWidth: 2,
                            borderColor: color,
                          }}
                        />
                      )}
                    </View>
                    <Text
                      style={{
                        fontSize: 9,
                        marginTop: 10,
                        color: colors.appWhite,
                        textAlign: 'center',
                        fontWeight: 'bold',
                      }}>
                      {labels[index]}
                    </Text>
                  </View>
                );
              })}
          </View>
          <Button text="Close" style={{margin: 10}} onPress={onRequestClose} />
        </View>
      )}
    </Modal>
  );
};

export default MetricExplainedModal;
