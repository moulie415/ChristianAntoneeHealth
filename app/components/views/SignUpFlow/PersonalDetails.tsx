import React, {useState} from 'react';

import Input from '../../commons/Input';
import Text from '../../commons/Text';
import colors from '../../../constants/colors';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Linking, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome6';
import DatePicker from '@react-native-community/datetimepicker';
import Modal from '../../commons/Modal';
import {Platform} from 'react-native';
import moment from 'moment';
import Button from '../../commons/Button';
import PickerModal from '../../commons/PickerModal';
import {HEIGHTS, WEIGHTS} from '../../../constants';
import Checkbox from '../../commons/Checkbox';
import {Gender} from '../../../types/Profile';
import {capitalizeFirstLetter} from '../../../helpers';

const PersonalDetails: React.FC<{
  name: string;
  setName: (name: string) => void;
  surname: string;
  setSurname: (name: string) => void;
  dob: string;
  setDob: (dob: string) => void;
  height: number;
  weight: number;
  setHeight: (height: number) => void;
  setWeight: (weight: number) => void;
  privacy: boolean;
  setPrivacy: (privacy: boolean) => void;
  marketing: boolean;
  setMarketing: (marketing: boolean) => void;
  gender: Gender;
  setGender: (gender: Gender) => void;
}> = ({
  name,
  setName,
  surname,
  setSurname,
  dob,
  setDob,
  height,
  weight,
  setHeight,
  setWeight,
  privacy,
  setPrivacy,
  marketing,
  setMarketing,
  gender,
  setGender,
}) => {
  const [showDobModal, setShowDobModal] = useState(false);
  const [showHeightModal, setShowHeightModal] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showSexModal, setShowSexModal] = useState(false);

  const genderArr: Gender[] = ['none', 'male', 'female'];

  const showDob = !!dob && moment().diff(dob, 'years') > 0;

  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      contentContainerStyle={{
        flex: 1,
        marginHorizontal: 20,
        marginTop: 20,
      }}
      style={{}}>
      <Text
        style={{
          marginBottom: 20,
          fontSize: 24,
          color: colors.appWhite,
          fontWeight: 'bold',
        }}>
        Personal Details
      </Text>
      <Input
        placeholder="First Name*"
        onChangeText={setName}
        value={name}
        icon="user"
        placeholderTextColor="#fff"
        autoCorrect={false}
      />
      <Input
        containerStyle={{
          marginTop: 20,
        }}
        placeholder="Last Name*"
        onChangeText={setSurname}
        value={surname}
        icon="user"
        placeholderTextColor="#fff"
        autoCorrect={false}
      />
      <TouchableOpacity
        onPress={() => setShowDobModal(true)}
        style={{
          borderColor: colors.borderColor,
          height: 50,
          borderWidth: 1,
          borderRadius: 12,
          padding: 15,
          paddingTop: 15,
          backgroundColor: '#363944',
          paddingLeft: 40,
          marginTop: 20,
        }}>
        <View
          style={{
            position: 'absolute',
            height: 50,
            justifyContent: 'center',
            alignItems: 'flex-end',
            left: 0,
            width: 30,
          }}>
          <Icon name="calendar" color={'#CECECE'} solid size={15} />
        </View>
        <Text
          style={{
            color: showDob ? colors.appWhite : 'rgba(255, 255, 255, 0.50)',
          }}>
          {showDob ? moment(dob).format('DD-MM-YYYY') : 'Date of birth*'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setShowSexModal(true)}
        style={{
          borderColor: colors.borderColor,
          height: 50,
          borderWidth: 1,
          borderRadius: 12,
          padding: 15,
          paddingTop: 15,
          backgroundColor: '#363944',
          paddingLeft: 40,
          marginTop: 20,
        }}>
        <View
          style={{
            position: 'absolute',
            height: 50,
            justifyContent: 'center',
            alignItems: 'flex-end',
            left: 0,
            width: 30,
          }}>
          <Icon name="venus-mars" color={'#CECECE'} solid size={15} />
        </View>
        <Text
          style={{
            color:
              gender !== 'none' ? colors.appWhite : 'rgba(255, 255, 255, 0.50)',
          }}>
          {gender !== 'none' ? capitalizeFirstLetter(gender) : 'Sex'}
        </Text>
      </TouchableOpacity>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => setShowWeightModal(true)}
          style={{
            borderColor: colors.borderColor,
            height: 50,
            borderWidth: 1,
            borderRadius: 12,
            padding: 15,
            paddingTop: 15,
            backgroundColor: '#363944',
            paddingLeft: 40,
            marginTop: 20,
            flex: 1,
            marginRight: 10,
          }}>
          <View
            style={{
              position: 'absolute',
              height: 50,
              justifyContent: 'center',
              alignItems: 'flex-end',
              left: 0,
              width: 30,
            }}>
            <Icon name="weight-hanging" color={'#CECECE'} solid size={15} />
          </View>
          <Text
            style={{
              color: weight ? colors.appWhite : 'rgba(255, 255, 255, 0.50)',
            }}>
            {weight ? `${weight} kg` : 'Weight*'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowHeightModal(true)}
          style={{
            borderColor: colors.borderColor,
            height: 50,
            borderWidth: 1,
            borderRadius: 12,
            padding: 15,
            paddingTop: 15,
            backgroundColor: '#363944',
            paddingLeft: 40,
            marginTop: 20,
            marginLeft: 10,
            flex: 1,
          }}>
          <View
            style={{
              position: 'absolute',
              height: 50,
              justifyContent: 'center',
              alignItems: 'flex-end',
              left: 0,
              width: 30,
            }}>
            <Icon name="ruler-vertical" color={'#CECECE'} solid size={15} />
          </View>
          <Text
            style={{
              color: height ? colors.appWhite : 'rgba(255, 255, 255, 0.50)',
            }}>
            {height ? `${height} cm` : 'Height*'}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{marginTop: 20, marginLeft: 10}}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            marginBottom: 10,
            alignItems: 'center',
          }}
          onPress={() => setPrivacy(!privacy)}>
          <Checkbox
            checked={privacy}
            onPress={() => setPrivacy(!privacy)}
            iconStyle={{color: colors.appWhite}}
          />
          <Text style={{marginLeft: 10, color: colors.appWhite}}>
            I've read the{' '}
            <Text
              onPress={() => {
                Linking.openURL('https://christianantonee.com/privacy-policy');
              }}
              style={{
                textDecorationLine: 'underline',
                fontWeight: 'bold',
                color: colors.appWhite,
              }}>
              Privacy Policy
            </Text>
            *
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setMarketing(!marketing)}
          style={{
            flexDirection: 'row',
            marginBottom: 20,
            alignItems: 'center',
          }}>
          <Checkbox
            checked={marketing}
            onPress={() => setMarketing(!marketing)}
            iconStyle={{color: colors.appWhite}}
          />
          <Text style={{marginLeft: 10, color: colors.appWhite, flex: 1}}>
            I want to join the CA Health mailing list and receive relevant
            articles offers and promotions
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={showDobModal && Platform.OS === 'ios'}
        onRequestClose={() => setShowDobModal(false)}>
        <View
          style={{
            backgroundColor: colors.appGrey,
            width: '90%',
            alignSelf: 'center',
            borderRadius: 10,
          }}>
          <Text
            style={{
              color: colors.appWhite,
              padding: 20,
              paddingBottom: 10,
              fontSize: 20,
              textAlign: 'center',
              fontWeight: 'bold',
            }}>
            Select date
          </Text>
          <View style={{paddingHorizontal: 20}}>
            <DatePicker
              mode="date"
              textColor={colors.appWhite}
              maximumDate={moment().subtract(18, 'years').toDate()}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              value={moment(dob).toDate()}
              onChange={(event, d: Date | undefined) => {
                setShowDobModal(true);
                setDob(d ? d.toISOString() : dob);
              }}
            />
          </View>

          <Button
            text="Close"
            style={{margin: 10}}
            onPress={() => setShowDobModal(false)}
          />
        </View>
      </Modal>
      {showDobModal && Platform.OS === 'android' && (
        <DatePicker
          mode="date"
          style={{}}
          textColor={colors.appWhite}
          maximumDate={moment().subtract(18, 'years').toDate()}
          display={'default'}
          value={moment(dob).toDate()}
          onChange={(event, d: Date | undefined) => {
            setShowDobModal(false);
            setDob(d ? d.toISOString() : dob);
          }}
        />
      )}
      <PickerModal
        title="Select height"
        visible={showHeightModal}
        selectedValue={String(height)}
        pickerData={HEIGHTS.map(value => {
          return {
            label: `${value.toString()} cm`,
            value: String(value),
          };
        })}
        onValueChange={val => setHeight(Number(val))}
        onRequestClose={() => setShowHeightModal(false)}
      />
      <PickerModal
        title="Select weight"
        visible={showWeightModal}
        selectedValue={String(weight)}
        pickerData={WEIGHTS.map(value => {
          return {
            label: `${value.toString()} kg`,
            value: String(value),
          };
        })}
        onValueChange={val => setWeight(Number(val))}
        onRequestClose={() => setShowWeightModal(false)}
      />
      <PickerModal
        title="Select sex"
        visible={showSexModal}
        selectedValue={gender}
        pickerData={genderArr.map(value => {
          return {
            label:
              value === 'none'
                ? 'Prefer not to say'
                : capitalizeFirstLetter(value),
            value,
          };
        })}
        onValueChange={val => setGender(val as Gender)}
        onRequestClose={() => setShowSexModal(false)}
      />
    </KeyboardAwareScrollView>
  );
};

export default PersonalDetails;
