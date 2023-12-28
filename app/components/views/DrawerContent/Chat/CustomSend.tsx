import React from 'react';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {IMessage, Send, SendProps} from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/FontAwesome6';
import colors from '../../../../constants/colors';
import {connect} from 'react-redux';
import {MyRootState} from '../../../../types/Shared';

interface Props extends SendProps<IMessage> {
  onPressAttachment: () => void;
  onPressVoiceNote: () => void;
  attachmentsDisabled: boolean;
  voiceNotesDisabled: boolean;
}

const CustomSend: React.FC<Props> = props => {
  if (props.text) {
    return (
      <View
        style={{
          height: '100%',
          justifyContent: 'center',
        }}>
        <Send
          {...props}
          containerStyle={{marginHorizontal: 10}}
          textStyle={[props.textStyle, {color: colors.appBlue}]}
        />
      </View>
    );
  }
  return (
    <View
      style={{flexDirection: 'row', justifyContent: 'center', height: '100%'}}>
      {!props.attachmentsDisabled && (
        <TouchableOpacity
          onPress={props.onPressAttachment}
          hitSlop={10}
          style={{padding: 10, alignSelf: 'center'}}>
          <Icon name="paperclip" size={25} color={colors.appBlue} />
        </TouchableOpacity>
      )}
      {!props.voiceNotesDisabled && (
        <TouchableOpacity
          onPress={props.onPressVoiceNote}
          hitSlop={10}
          style={{padding: 10, paddingRight: 15, alignSelf: 'center'}}>
          <Icon name="microphone" size={25} color={colors.appBlue} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const mapStateToProps = ({settings}: MyRootState) => ({
  attachmentsDisabled: settings.attachmentsDisabled,
  voiceNotesDisabled: settings.voiceNotesDisabled,
});

export default connect(mapStateToProps)(CustomSend);
