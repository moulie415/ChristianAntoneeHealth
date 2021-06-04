import React, {FunctionComponent} from 'react';
import styles from '../../styles/views/FitnessTesting';
import FitnessTestingProps from '../../types/views/FitnessTesting';
import {TouchableOpacity, View, Image} from 'react-native';
import {MyRootState} from '../../types/Shared';
import {connect} from 'react-redux';
import colors from '../../constants/colors';
import {Text} from '@ui-kitten/components';
import globalStyles from '../../styles/globalStyles';
import ImageLoader from '../commons/ImageLoader';

const FitnessTesting: FunctionComponent<FitnessTestingProps> = ({
  navigation,
  tests,
}) => {
  return (
    <View style={{backgroundColor: colors.appBlack, flex: 1}}>
      <View style={{flex: 1}}>
        <TouchableOpacity style={{flex: 1, marginVertical: 5}}>
          <ImageLoader
            style={{width: '100%', flex: 1}}
            resizeMode="cover"
            source={require('../../images/strength.jpeg')}
          />
          <View style={{position: 'absolute', bottom: 0, margin: 5}}>
            <Text category="h5" style={globalStyles.textShadow}>
              Strength
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{flex: 1, marginVertical: 5}}>
          <ImageLoader
            style={{width: '100%', flex: 1}}
            delay={300}
            resizeMode="cover"
            source={require('../../images/balance.jpeg')}
          />
          <View style={{position: 'absolute', bottom: 0, right: 0, margin: 5}}>
            <Text category="h5" style={globalStyles.textShadow}>
              Balance
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{flex: 1, marginVertical: 5}}>
          <ImageLoader
            style={{width: '100%', flex: 1}}
            delay={600}
            resizeMode="cover"
            source={require('../../images/cardio.jpeg')}
          />
          <View style={{position: 'absolute', bottom: 0, margin: 5}}>
            <Text category="h5" style={globalStyles.textShadow}>
              Cardio
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{flex: 1, marginVertical: 5}}>
          <ImageLoader
            style={{width: '100%', flex: 1}}
            delay={900}
            resizeMode="cover"
            source={require('../../images/flexibility.jpeg')}
          />
          <View style={{position: 'absolute', bottom: 0, right: 0, margin: 5}}>
            <Text category="h5" style={globalStyles.textShadow}>
              Flexibility
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const mapStateToProps = ({tests}: MyRootState) => ({
  tests: tests.tests,
});

export default connect(mapStateToProps)(FitnessTesting);
