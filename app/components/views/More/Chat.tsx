import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import db, {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {StackParamList} from '../../../App';
import Profile from '../../../types/Profile';
import {MyRootState} from '../../../types/Shared';
import {connect} from 'react-redux';
import {setMessages} from '../../../actions/profile';
import Message from '../../../types/Message';
import Avatar from '../../commons/Avatar';
import {TouchableOpacity} from 'react-native';

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
}

const Chat: React.FC<ChatProps> = ({
  route,
  profile,
  setMessagesAction,
  messagesObj,
  navigation,
  connection,
}) => {
  const [messages, setMessages] = useState(Object.values(messagesObj || {}));
  console.log(messages);
  const {uid} = route.params;
  useEffect(() => {
    let subscriber: () => void;
    const getMessages = async () => {
      const idQuery = await db()
        .collection('chats')
        .where('users', 'array-contains-any', [profile.uid, uid])
        .get();
      const {id} = idQuery.docs[0];
      console.log(id);
      subscriber = db()
        .collection('chats')
        .doc(id)
        .collection('messages')
        .limit(20)
        .onSnapshot(
          snapshot => {
            setMessagesAction(uid, snapshot);
            console.log(snapshot);
          },
          error => {
            console.log(error);
          },
        );
    };
    getMessages();
    return () => {
      if (subscriber) {
        subscriber();
      }
    };
  }, [profile.uid, uid, setMessagesAction]);

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
    />
  );
};

const mapStateToProps = ({profile}: MyRootState, props: ChatProps) => ({
  profile: profile.profile,
  messagesObj: profile.messages[props.route.params.uid],
  connection: profile.connections[props.route.params.uid],
});

const mapDispatchToProps = {
  setMessagesAction: setMessages,
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
