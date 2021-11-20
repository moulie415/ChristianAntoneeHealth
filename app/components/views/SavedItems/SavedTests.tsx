import {Layout, List, ListItem, Text} from '@ui-kitten/components';
import React, {FunctionComponent, useEffect} from 'react';
import {View} from 'react-native';
import moment from 'moment';
import {connect} from 'react-redux';
import {getSavedTests} from '../../../actions/tests';
import {SavedTest} from '../../../types/SavedItem';
import {MyRootState} from '../../../types/Shared';
import ImageOverlay from '../../commons/ImageOverlay';
import DevicePixels from '../../../helpers/DevicePixels';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';

const SavedTests: FunctionComponent<{
  loading: boolean;
  savedTests: {[key: string]: SavedTest};
  getSavedTestsAction: () => void;
}> = ({loading, savedTests, getSavedTestsAction}) => {
  useEffect(() => {
    getSavedTestsAction();
  }, [getSavedTestsAction]);
  return (
    <Layout>
      <List
        data={Object.values(savedTests)}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          return (
            <ListItem
              onPress={() => {}}
              title={moment(item.createddate).format('MMMM Do YYYY, HH:mm')}
              description={''}
              accessoryLeft={() => (
                <ImageOverlay
                  containerStyle={{
                    height: DevicePixels[75],
                    width: DevicePixels[75],
                  }}
                  overlayAlpha={0.4}
                  source={require('../../../images/old_man_stretching.jpeg')}>
                  <View style={{alignItems: 'center'}}>
                    <Text style={{color: '#fff', fontSize: DevicePixels[12]}}>
                      {'Duration '}
                    </Text>
                    <Text category="h6" style={{color: '#fff'}}>
                      {moment()
                        .utc()
                        .startOf('day')
                        .add({seconds: item.seconds})
                        .format('mm:ss')}
                    </Text>
                  </View>
                </ImageOverlay>
              )}
            />
          );
        }}
      />
      <AbsoluteSpinner loading={loading} />
    </Layout>
  );
};

const mapStateToProps = ({exercises, tests}: MyRootState) => ({
  loading: exercises.loading,
  savedTests: tests.savedTests,
});

const mapDispatchToProps = {
  getSavedTestsAction: getSavedTests,
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedTests);
