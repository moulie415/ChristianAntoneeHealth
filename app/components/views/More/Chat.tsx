import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome5';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {
  GiftedChat,
  Avatar as GiftedAvatar,
  AvatarProps,
  MessageText,
  BubbleProps,
  MessageTextProps,
} from 'react-native-gifted-chat';
import {StackParamList} from '../../../App';
import Profile from '../../../types/Profile';
import {MyRootState} from '../../../types/Shared';
import {connect} from 'react-redux';
import {
  loadEarlierMessages,
  sendMessage,
  setMessages,
  setRead,
} from '../../../actions/profile';
import Message from '../../../types/Message';
import {ImageBackground, Platform, TouchableOpacity, View} from 'react-native';
import moment from 'moment';
import Avatar from '../../commons/Avatar';
import DevicePixels from '../../../helpers/DevicePixels';
import Text from '../../commons/Text';
import colors from '../../../constants/colors';
import {viewWorkout} from '../../../actions/exercises';
import AbsoluteSpinner from '../../commons/AbsoluteSpinner';
import Animated, {FadeIn} from 'react-native-reanimated';
import {SafeAreaView} from 'react-native-safe-area-context';
import Header from '../../commons/Header';
import FastImage from 'react-native-fast-image';

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
  viewWorkoutAction: (workout: string[]) => void;
  exercisesLoading: boolean;
  loadEarlierMessages: (
    chatId: string,
    uid: string,
    startAfter: number,
  ) => void;
  loading: boolean;
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
  viewWorkoutAction,
  exercisesLoading,
  loadEarlierMessages: loadEarlierMessagesAction,
  loading,
}) => {
  const {uid} = route.params;
  const ref = useRef<GiftedChat>();

  useEffect(() => {
    setReadAction(uid);
    return () => {
      setReadAction(uid);
    };
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

  const loadEarlier = useCallback(async () => {
    const sorted = sortMessages();
    const startAfter = sorted[0].createdAt;
    loadEarlierMessagesAction(chatId, uid, startAfter as number);
  }, [sortMessages, chatId, uid, loadEarlierMessagesAction]);

  const showLoadEarlier = useMemo(() => {
    return !sortMessages().some(m => m.text === 'Beginning of chat');
  }, [sortMessages]);

  useEffect(() => {
    setTimeout(() => {
      ref.current?.scrollToBottom();
    }, 2000);
  }, []);

  const renderCustomView = (props: BubbleProps<Message>) => {
    switch (props.currentMessage.type) {
      case 'workout':
        return (
          <TouchableOpacity
            onPress={() => viewWorkoutAction(props.currentMessage.workout)}
            style={{
              padding: DevicePixels[10],
              margin: DevicePixels[10],
              borderRadius: 5,
              backgroundColor: '#fff',
              justifyContent: 'space-evenly',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Icon
              size={DevicePixels[30]}
              name="dumbbell"
              style={{color: colors.appBlue}}
            />
            <Text style={{fontWeight: 'bold', color: colors.appBlue}}>
              Press to view workout
            </Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  const renderMessageText = (props: MessageTextProps<Message>) => {
    switch (props.currentMessage.type) {
      case 'text':
      case 'workout':
        return <MessageText {...props} />;
      default:
        const newProps = {
          ...props,
          currentMessage: {
            ...props.currentMessage,
            text: 'Unknown message type',
          },
        };
        return (
          <MessageText
            {...newProps}
            textStyle={{
              left: {fontStyle: 'italic', fontFamily: 'normal'},
              right: {fontStyle: 'italic', fontFamily: 'normal'},
            }}
          />
        );
    }
  };

  const renderAvatar = (props: AvatarProps<Message>) => {
    return (
      <GiftedAvatar
        {...props}
        containerStyle={{
          left: {
            marginRight: Platform.OS === 'ios' ? DevicePixels[10] : 0,
          },
          right: {},
        }}
        renderAvatar={(p: AvatarProps<Message>) =>
          p ? (
            <Avatar
              name={connection.name}
              src={connection.avatar}
              size={DevicePixels[30]}
            />
          ) : null
        }
      />
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.appGrey}}>
      <SafeAreaView style={{flex: 1}}>
        <Header
          title={connection.name}
          hasBack
          right={
            <TouchableOpacity>
              <Avatar src={connection.avatar} name={connection.name} />
            </TouchableOpacity>
          }
        />
        <Animated.View
          entering={FadeIn.duration(1000).delay(500)}
          style={{flex: 1}}>
          <GiftedChat
            renderCustomView={renderCustomView}
            ref={ref}
            messagesContainerStyle={{
              paddingTop: Platform.OS === 'ios' ? 0 : DevicePixels[50],
            }}
            loadEarlier={showLoadEarlier}
            isLoadingEarlier={loading}
            onLoadEarlier={loadEarlier}
            renderMessageText={renderMessageText}
            messages={sortMessages()}
            user={{
              _id: profile.uid,
              name: profile.name,
              avatar: profile.avatar,
            }}
            inverted={false}
            renderAvatar={renderAvatar}
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
          <AbsoluteSpinner
            loading={exercisesLoading}
            text="Fetching exercises"
          />
        </Animated.View>
      </SafeAreaView>
    </View>
  );
};

const mapStateToProps = (
  {profile, exercises}: MyRootState,
  props: ChatProps,
) => ({
  profile: profile.profile,
  messagesObj: profile.messages[props.route.params.uid],
  connection: profile.connections[props.route.params.uid],
  chatId: profile.chats[props.route.params.uid].id,
  exercisesLoading: exercises.loading,
  loading: profile.loading,
});

const mapDispatchToProps = {
  setMessagesAction: setMessages,
  sendMessageAction: sendMessage,
  setReadAction: setRead,
  viewWorkoutAction: viewWorkout,
  loadEarlierMessages,
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
