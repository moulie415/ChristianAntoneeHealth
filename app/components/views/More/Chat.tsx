import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import db, {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import React, {useCallback, useEffect, useState} from 'react';
import {AvatarProps, GiftedChat} from 'react-native-gifted-chat';
import {StackParamList} from '../../../App';
import Profile from '../../../types/Profile';
import {MyRootState} from '../../../types/Shared';
import {connect} from 'react-redux';
import {sendMessage, setMessages} from '../../../actions/profile';
import Message from '../../../types/Message';
import Avatar from '../../commons/Avatar';
import {TouchableOpacity} from 'react-native';
import moment from 'moment';

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
}) => {
  const [messages, setMessages] = useState(Object.values(messagesObj || {}));

  const {uid} = route.params;
  useEffect(() => {
    const subscriber = db()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .limit(20)
      .onSnapshot(
        snapshot => {
          setMessagesAction(uid, snapshot);
        },
        error => {
          console.warn(error);
        },
      );

    return () => {
      subscriber();
    };
  }, [uid, setMessagesAction, chatId]);

  useEffect(() => {
    setMessages(Object.values(messagesObj || {}));
  }, [messagesObj]);

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

  return (
    <GiftedChat
      messages={messages}
      user={{_id: profile.uid, name: profile.name, avatar: profile.avatar}}
      inverted={false}
      onSend={msgs => {
        const message: Message = {
          ...msgs[0],
          type: 'text',
          pending: true,
          createdAt: moment().unix(),
        };
        sendMessageAction(message, chatId, uid);
      }}
    />
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
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
