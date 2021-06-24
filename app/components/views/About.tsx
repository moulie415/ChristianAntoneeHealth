import {Text} from '@ui-kitten/components';
import React, {FunctionComponent} from 'react';
import {Linking, ScrollView, TouchableOpacity} from 'react-native';
import colors from '../../constants/colors';
import AboutProps from '../../types/views/About';

const About: FunctionComponent<AboutProps> = () => {
  return (
    <ScrollView style={{backgroundColor: colors.appBlack, flex: 1}}>
      <TouchableOpacity
        onPress={() => Linking.openURL('https://healthandmovement.co.uk/')}>
        <Text
          style={{color: colors.appBlue, textAlign: 'center', marginTop: 20}}>
          www.healthandmovement.co.uk
        </Text>
      </TouchableOpacity>
      <Text category="h5" style={{textAlign: 'center', marginTop: 20}}>
        About Us
      </Text>
      <Text style={{margin: 10, lineHeight: 25}}>
        {
          'At the age of 16 Christian began his career in the health and fitness industry as a volunteer at a local health club in Ottawa, Canada. It was there that he gained an appreciation for exercise prescription and obtained a qualification as a personal trainer. The next step took him to Vancouver on the West coast of Canada where he completed an undergraduate degree in Kinesiology and Psychology.'
        }
      </Text>
      <Text style={{margin: 10, lineHeight: 25}}>
        {
          'After returning to the UK Christian obtained a qualification as an Osteopath from the British College of Osteopathic Medicine and is currently pursuing a MSc in Clinical Pain management from The University of Edinburgh. By combining principles in exercise prescription, manual therapy and nutrition Christian takes a movement based approach to treating your pain and dysfunction, with a special interest in repetitive strain injuries, sports injuries and neck/low back pain.'
        }
      </Text>
    </ScrollView>
  );
};

export default About;
