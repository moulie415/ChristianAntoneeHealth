import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import db, {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import React, {useCallback, useEffect, useState} from 'react';
import {
  GiftedChat,
  Avatar as GiftedAvatar,
  AvatarProps,
} from 'react-native-gifted-chat';
import {StackParamList} from '../../../App';
import Profile from '../../../types/Profile';
import {MyRootState} from '../../../types/Shared';
import {connect} from 'react-redux';
import {sendMessage, setMessages, setRead} from '../../../actions/profile';
import Message from '../../../types/Message';
import {TouchableOpacity, View} from 'react-native';
import moment from 'moment';
import Avatar from '../../commons/Avatar';
import DevicePixels from '../../../helpers/DevicePixels';

interface ChatProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Chat'>;
  route: RouteProp<StackParamList, 'Chat'>;
  profile: Profile;
  setMessagesAction: (
    uid: string,
    snapshot: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>,
  ) => void;
  messagesObj: {[key: string]: Message};
  connection: Profile;
  chatId: string;
  sendMessageAction: (message: Message, chatId: string, uid: string) => void;
  setReadAction: (uid: string) => void;
}

const Chat: React.FC<ChatProps> = ({
  route,
  profile,
  setMessagesAction,
  messagesObj,
  navigation,
  connection,
  chatId,
  sendMessageAction,
  setReadAction,
}) => {

  const {uid} = route.params;

  useEffect(() => {
    navigation.setOptions({
      headerTitle: connection.name,
      headerRight: () => (
        <TouchableOpacity>
          <Avatar src={connection.avatar} name={connection.name} />
        </TouchableOpacity>
      ),
    });
  }, [navigation, connection.name, connection.avatar]);

  useEffect(() => {
    setReadAction(uid);
  }, [uid, setReadAction]);

  const sortMessages = useCallback(() => {
    const messages = Object.values(messagesObj || {});
    return messages
      .sort((a, b) => (a.createdAt as number) - (b.createdAt as number))
      .map(message => {
        if (message.user) {
          return {
            ...message,
            user: {...message.user, avatar: message.user.avatar || undefined},
          };
        }
        return message;
      });
  }, [messagesObj]);

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <GiftedChat
        messages={sortMessages()}
        user={{_id: profile.uid, name: profile.name, avatar: profile.avatar}}
        inverted={false}
        renderAvatar={props => {
          return (
            <GiftedAvatar
              {...props}
              renderAvatar={(p: AvatarProps<Message>) =>
                p ? (
                  <Avatar
                    name={p.currentMessage.user.name}
                    src={p.currentMessage.user.avatar as string}
                    size={DevicePixels[30]}
                  />
                ) : null
              }
            />
          );
        }}
        onSend={msgs => {
          const message: Message = {
            ...msgs[0],
            type: 'text',
            pending: true,
            createdAt: moment().valueOf(),
          };
          sendMessageAction(message, chatId, uid);
        }}
      />
    </View>
  );
};

const mapStateToProps = ({profile}: MyRootState, props: ChatProps) => ({
  profile: profile.profile,
  messagesObj: profile.messages[props.route.params.uid],
  connection: profile.connections[props.route.params.uid],
  chatId: profile.chats[props.route.params.uid].id,
});

const mapDispatchToProps = {
  setMessagesAction: setMessages,
  sendMessageAction: sendMessage,
  setReadAction: setRead,
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
