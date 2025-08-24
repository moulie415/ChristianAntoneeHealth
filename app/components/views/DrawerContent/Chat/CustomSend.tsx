import React from 'react';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {IMessage, Send, SendProps} from 'react-native-gifted-chat';
import {FontAwesome6} from '@react-native-vector-icons/fontawesome6';
import {connect} from 'react-redux';
import {RootState} from '../../../../App';
import colors from '../../../../constants/colors';

interface Props extends SendProps<IMessage> {
  onPressAttachment: () => void;
  onPressVoiceNote: () => void;
  onPressDocument: () => void;
  attachmentsDisabled: boolean;
  voiceNotesDisabled: boolean;
}

const CustomSend: React.FC<Props> = props => {
  if (props.text) {
    return (
      <Send
        {...props}
        containerStyle={{marginHorizontal: 10, alignSelf: 'center'}}
        textStyle={[props.textStyle, {color: colors.appBlue}]}
      />
    );
  }
  return (
    <View
      style={{flexDirection: 'row', justifyContent: 'center', height: '100%'}}>
      {!props.attachmentsDisabled && (
        <TouchableOpacity
          onPress={props.onPressDocument}
          style={{
            paddingVertical: 8,
            paddingTop: 10,
            paddingRight: 15,
          }}>
          <FontAwesome6 name="file" iconStyle="solid" size={22} color={colors.appBlue} />
        </TouchableOpacity>
      )}
      {!props.attachmentsDisabled && (
        <TouchableOpacity
          onPress={props.onPressAttachment}
          hitSlop={10}
          style={{
            paddingVertical: 8,
            paddingRight: 13,
            alignSelf: 'center',
          }}>
          <FontAwesome6 name="image" iconStyle="solid" size={25} color={colors.appBlue} />
        </TouchableOpacity>
      )}
      {!props.voiceNotesDisabled && (
        <TouchableOpacity
          onPress={props.onPressVoiceNote}
          hitSlop={10}
          style={{
            paddingVertical: 8,
            paddingRight: 15,
            alignSelf: 'center',
          }}>
          <FontAwesome6 iconStyle="solid" name="microphone" size={25} color={colors.appBlue} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const mapStateToProps = ({settings}: RootState) => ({
  attachmentsDisabled: settings.attachmentsDisabled,
  voiceNotesDisabled: settings.voiceNotesDisabled,
});

export default connect(mapStateToProps)(CustomSend);
