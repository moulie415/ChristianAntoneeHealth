import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import db, {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {StackParamList} from '../../../App';
import Profile from '../../../types/Profile';
import {MyRootState} from '../../../types/Shared';
import {connect} from 'react-redux';
import {setMessages} from '../../../actions/profile';
import Message from '../../../types/Message';

interface ChatProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Chat'>;
  route: RouteProp<StackParamList, 'Chat'>;
  profile: Profile;
  setMessagesAction: (
    uid: string,
    snapshot: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>,
  ) => void;
  messages: {[key: string]: Message};
}

const Chat: React.FC<ChatProps> = ({
  route,
  profile,
  setMessagesAction,
  messages,
}) => {
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
      subscriber = db()
        .collection('chats')
        .doc(id)
        .collection('messages')
        .limit(20)
        .onSnapshot(
          snapshot => {
            setMessagesAction(uid, snapshot);
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
  return (
    <View>
      <Text />
    </View>
  );
};

const mapStateToProps = ({profile}: MyRootState, props: ChatProps) => ({
  profile: profile.profile,
  messages: profile.messages[props.route.params.uid],
});

const mapDispatchToProps = {
  setMessagesAction: setMessages,
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
