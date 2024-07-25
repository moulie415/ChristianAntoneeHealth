import {SVGRenderer, SvgChart} from '@wuba/react-native-echarts';
import {LineChart} from 'echarts/charts';
import {GridComponent} from 'echarts/components';
import * as echarts from 'echarts/core';
import moment from 'moment';
import React, {useEffect, useRef} from 'react';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import {RootState} from '../../App';
import colors from '../../constants/colors';
import {setFilter} from '../../reducers/profile';
import Button from './Button';
import Text from './Text';

echarts.use([SVGRenderer, LineChart, GridComponent]);

const ProfileGraph: React.FC<{
  setShowModal: (show: boolean) => void;
  data: {x: Date; y: number}[];
  setFilter: (filter: 6 | 30 | 365) => void;
  filter: 6 | 30 | 365;
}> = ({setShowModal, data, setFilter: setFilterAction, filter}) => {
  const svgRef = useRef<any>(null);
  useEffect(() => {
    const option = {
      xAxis: {
        type: 'category',
        data: data.map(({x}) =>
          moment(x).format(
            filter === 6 ? 'dd' : filter === 30 ? 'DD/MM' : 'MMM',
          ),
        ),
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: data.map(d => d.y),
          type: 'line',
          lineStyle: {color: colors.appBlue},
          itemStyle: {color: colors.appBlue},
        },
      ],
    };
    let chart: any;
    if (svgRef.current) {
      chart = echarts.init(svgRef.current, 'light', {
        renderer: 'svg',
        width: Dimensions.get('window').width * 0.9,
        height: 300,
      });
      chart.setOption(option);
    }
    return () => chart?.dispose();
  }, [data, filter]);
  return (
    <View
      style={{
        width: '95%',
        backgroundColor: colors.appGrey,
        borderRadius: 15,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          marginTop: 20,
        }}>
        <TouchableOpacity style={{}} onPress={() => setFilterAction(6)}>
          <View
            style={{
              height: 40,
              paddingHorizontal: 20,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 12,
              backgroundColor: filter === 6 ? colors.appBlue : 'transparent',
              borderWidth: filter === 6 ? 0 : 1,
              borderColor: colors.borderColor,
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                color: '#fff',
                textAlign: 'center',
              }}>
              1W
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{}} onPress={() => setFilterAction(30)}>
          <View
            style={{
              height: 40,
              paddingHorizontal: 20,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 12,
              backgroundColor: filter === 30 ? colors.appBlue : 'transparent',
              borderWidth: filter === 30 ? 0 : 1,
              borderColor: colors.borderColor,
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                color: '#fff',
                textAlign: 'center',
              }}>
              1M
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{}} onPress={() => setFilterAction(365)}>
          <View
            style={{
              height: 40,
              paddingHorizontal: 20,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 12,
              backgroundColor: filter === 365 ? colors.appBlue : 'transparent',
              borderWidth: filter === 365 ? 0 : 1,
              borderColor: colors.borderColor,
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                color: '#fff',
                textAlign: 'center',
              }}>
              1Y
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <SvgChart ref={svgRef} />
      <View style={{padding: 20}}>
        <Button text="Close" onPress={() => setShowModal(false)} />
      </View>
    </View>
  );
};

const mapStateToProps = ({profile}: RootState) => ({
  filter: profile.filter,
});

const mapDispatchToProps = {
  setFilter,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileGraph);
