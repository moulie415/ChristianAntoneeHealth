import React from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import {connect} from 'react-redux';
import {RootState} from '../../App';
import colors from '../../constants/colors';
import {capitalizeFirstLetter} from '../../helpers';
import Fire from '../../images/fire.svg';
import Time from '../../images/time.svg';
import {Profile} from '../../types/Shared';
import Button from '../commons/Button';
import Modal from '../commons/Modal';
import Text from '../commons/Text';

const ICON_SIZE = 100;
const Goals: React.FC<{
  profile: Profile;
  visible: boolean;
  onRequestClose: () => void;
}> = ({profile, visible, onRequestClose}) => {
  const goalData = profile.targets;
  const workoutGoal = goalData?.workouts.number;
  const minsGoal = goalData?.mins;
  const workoutLevelTitleString = capitalizeFirstLetter(
    goalData?.workouts.level || '',
  );
  const caloriesGoal = goalData?.calories || 0;
  return (
    <Modal visible={visible} onRequestClose={onRequestClose}>
      <View
        style={{
          backgroundColor: colors.appGrey,
          width: '90%',
          borderRadius: 10,
          //  height: '50%',
          padding: 20,
        }}>
        <Text
          style={{
            color: colors.appWhite,
            fontSize: 25,
            textAlign: 'center',
            marginBottom: 20,
          }}>
          Here are your weekly targets...
        </Text>
        <View style={{alignItems: 'center', marginVertical: 20}}>
          <Time />
          <Text
            style={{
              color: colors.appWhite,
              fontSize: 16,
              marginTop: 10,
              marginBottom: 40,
              textAlign: 'center',
            }}>
            {'Spend '}
            <Text style={{fontWeight: 'bold'}}>{minsGoal}</Text>
            {' minutes training'}
          </Text>
          <Icon
            name="gauge-high"
            size={25}
            color={colors.button}
            style={{
              marginHorizontal: 15,
            }}
          />
          <Text
            style={{
              color: colors.appWhite,
              fontSize: 16,
              marginTop: 10,
              marginBottom: 40,
              textAlign: 'center',
            }}>
            {'Complete '}
            <Text
              style={{
                fontWeight: 'bold',
              }}>{`${workoutGoal} `}</Text>
            {`${workoutLevelTitleString} workouts`}
          </Text>
          <Fire />
          <Text
            style={{
              color: colors.appWhite,
              fontSize: 16,
              marginTop: 10,
              marginBottom: 20,
              textAlign: 'center',
            }}>
            {'Burn '}
            <Text style={{fontWeight: 'bold'}}>{caloriesGoal}</Text>
            {' calories'}
          </Text>
        </View>
        <Text
          style={{
            color: colors.appWhite,
            fontSize: 16,
            marginTop: 10,
            marginBottom: 20,
            textAlign: 'center',
          }}>
          These targets can be viewed anytime from the profile tab
        </Text>
        <Button
          text="Close"
          style={{marginVertical: 10}}
          onPress={onRequestClose}
        />
      </View>
    </Modal>
  );
};

const mapStateToProps = ({profile}: RootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(Goals);
