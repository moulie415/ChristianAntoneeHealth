import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome6';
import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  GiftedChat,
  Avatar as GiftedAvatar,
  AvatarProps,
  MessageText,
  BubbleProps,
  MessageTextProps,
  Bubble,
  IMessage,
  MessageVideoProps,
} from 'react-native-gifted-chat';
import {StackParamList} from '../../../../App';
import Profile from '../../../../types/Profile';
import {MyRootState} from '../../../../types/Shared';
import {connect} from 'react-redux';
import Message, {MessageType} from '../../../../types/Message';
import {
  Alert,
  FlatList,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import moment from 'moment';
import Avatar from '../../../commons/Avatar';
import Text from '../../../commons/Text';
import colors from '../../../../constants/colors';
import AbsoluteSpinner from '../../../commons/AbsoluteSpinner';
import Animated, {FadeIn} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Header from '../../../commons/Header';
import FastImage from 'react-native-fast-image';
import useInit from '../../../../hooks/UseInit';
import _ from 'lodash';
import {
  loadEarlierMessages,
  sendMessage,
  setChatMessage,
  setMessages,
  setRead,
} from '../../../../reducers/profile';
import {viewWorkout} from '../../../../reducers/exercises';
import CustomInputToolbar from './CustomInputToolbar';
import CustomSend from './CustomSend';
import CustomActions from './CustomActions';
import {
  CameraOptions,
  ImageLibraryOptions,
  ImagePickerResponse,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {logError} from '../../../../helpers/error';
import Snackbar from 'react-native-snackbar';
import uuid from 'react-native-uuid';
import Video from 'react-native-video';
import convertToProxyURL from 'react-native-video-cache';

interface ChatProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Chat'>;
  route: RouteProp<StackParamList, 'Chat'>;
  profile: Profile;
  setMessagesAction: ({
    uid,
    snapshot,
  }: {
    uid: string;
    snapshot: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>;
  }) => void;
  messagesObj: {[key: string]: Message};
  connection: Profile;
  chatId: string;
  sendMessageAction: ({
    message,
    chatId,
    uid,
  }: {
    message: Message;
    chatId: string;
    uid: string;
  }) => void;
  setReadAction: (uid: string) => void;
  viewWorkoutAction: (workout: string[]) => void;
  exercisesLoading: boolean;
  loadEarlierMessages: ({
    chatId,
    uid,
    startAfter,
  }: {
    chatId: string;
    uid: string;
    startAfter: number;
  }) => void;
  loading: boolean;
  chatMessages: {[key: string]: string};
  setChatMessage: ({uid, message}: {uid: string; message: string}) => void;
}

const Chat: React.FC<ChatProps> = ({
  route,
  profile,
  messagesObj,
  connection,
  chatId,
  sendMessageAction,
  setReadAction,
  viewWorkoutAction,
  exercisesLoading,
  loadEarlierMessages: loadEarlierMessagesAction,
  loading,
  chatMessages,
  setChatMessage: setChatMessageAction,
  navigation,
}) => {
  const {uid} = route.params;
  const [text, setText] = useState('');
  const [initialized, setInitialized] = useState(false);

  const persistChat = useMemo(
    () =>
      _.debounce(t => {
        setChatMessageAction({uid, message: t});
      }, 1000),
    [setChatMessageAction, uid],
  );

  const onInputTextChanged = (t: string) => {
    setText(t);
    if (initialized) {
      persistChat(t);
    }
  };

  useEffect(() => {
    setReadAction(uid);
    return () => {
      setReadAction(uid);
    };
  }, [uid, setReadAction]);

  useInit(() => {
    setTimeout(() => {
      setInitialized(true);
      if (chatMessages[uid]) {
        setText(chatMessages[uid]);
      }
    }, 500);
  });

  const sortMessages = useCallback(() => {
    const messages = Object.values(messagesObj || {});
    return messages
      .sort((a, b) => (a.createdAt as number) - (b.createdAt as number))
      .map(message => {
        return {
          ...message,
          user: {...message.user, avatar: message.user?.avatar || undefined},
        };
      });
  }, [messagesObj]);

  const loadEarlier = useCallback(async () => {
    const sorted = sortMessages();
    const startAfter = sorted[0].createdAt;
    loadEarlierMessagesAction({chatId, uid, startAfter: Number(startAfter)});
  }, [sortMessages, chatId, uid, loadEarlierMessagesAction]);

  const showLoadEarlier = useMemo(() => {
    return !sortMessages().some(m => m.text === 'Beginning of chat');
  }, [sortMessages]);

  const insets = useSafeAreaInsets();

  const renderCustomView = (props: BubbleProps<Message>) => {
    switch (props.currentMessage?.type) {
      case 'workout':
        return (
          <TouchableOpacity
            onPress={() => {
              if (props.currentMessage?.workout) {
                viewWorkoutAction(props.currentMessage?.workout);
              }
            }}
            style={{
              padding: 10,
              margin: 10,
              borderRadius: 5,
              backgroundColor: '#fff',
              justifyContent: 'space-evenly',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Icon size={30} name="dumbbell" style={{color: colors.appBlue}} />
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
    switch (props.currentMessage?.type) {
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
          // @ts-ignore
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

  const renderAvatar = (props: AvatarProps<IMessage>) => {
    return (
      <GiftedAvatar
        {...props}
        containerStyle={{
          left: {
            // marginRight: Platform.OS === 'ios' ? 10 : 0,
          },
          right: {},
        }}
        renderAvatar={(p: AvatarProps<Message>) =>
          p ? (
            <Avatar
              uid={connection.uid}
              name={`${connection.name} ${connection.surname || ''}`}
              src={connection.avatar}
              size={28}
            />
          ) : null
        }
      />
    );
  };

  const renderMessageVideo = (props: MessageVideoProps<IMessage>) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (props.currentMessage) {
            navigation.navigate('VideoView', {message: props.currentMessage});
          }
        }}
        style={{position: 'relative', height: 150, width: 250, margin: 3}}>
        <Video
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            height: 150,
            width: 250,
            borderRadius: 15,
          }}
          resizeMode="cover"
          muted
          paused
          source={{uri: convertToProxyURL(props.currentMessage?.video || '')}}>
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon name="play" color={colors.appWhite} size={40} />
          </View>
        </Video>
      </TouchableOpacity>
    );
  };

  const handleResponse = async (response: ImagePickerResponse) => {
    try {
      if (response.assets) {
        const asset = response.assets[0];

        let type: MessageType;
        if (asset.type?.includes('image/')) {
          type = 'image';
        } else if (asset.type?.includes('video/')) {
          type = 'video';
        } else {
          throw new Error('Unsupported mime type');
        }

        const message: Message = {
          user: {
            _id: profile.uid,
            name: profile.name,
            avatar: profile.avatar,
          },
          _id: uuid.v4() as string,
          ...(type === 'image' ? {image: asset.uri} : {}),
          ...(type === 'video' ? {video: asset.uri} : {}),
          text: '',
          type,
          pending: true,
          createdAt: moment().valueOf(),
        };
        sendMessageAction({message, chatId, uid});
        ref.current?.scrollToEnd();
      }
    } catch (e) {
      logError(e);
      Snackbar.show({text: 'Error sending message'});
    }
  };

  const onPressAttachment = async () => {
    const options: ImageLibraryOptions = {
      mediaType: 'mixed',
      formatAsMp4: true,
    };
    if (Platform.OS === 'ios') {
      const result = await launchImageLibrary(options);
      handleResponse(result);
    }
  };

  const onPressVoiceNote = () => {};

  const onPressCamera = async () => {
    const options: CameraOptions = {
      mediaType: 'mixed',
      formatAsMp4: true,
    };
    if (Platform.OS === 'ios') {
      const result = await launchCamera(options);
      handleResponse(result);
    }
  };

  const ref = useRef<FlatList>(null);

  return (
    <>
      <SafeAreaView style={{backgroundColor: colors.appGrey, flex: 1}}>
        <Header
          title={connection.name}
          hasBack
          right={
            <TouchableOpacity
              onPress={() => navigation.navigate('ViewProfile', {connection})}>
              <Avatar
                src={connection.avatar}
                name={`${connection.name} ${connection.surname || ''}`}
                uid={connection.uid}
              />
            </TouchableOpacity>
          }
        />
        <GiftedChat
          messageContainerRef={ref}
          renderCustomView={renderCustomView}
          loadEarlier={showLoadEarlier}
          isLoadingEarlier={loading}
          onLoadEarlier={loadEarlier}
          keyboardShouldPersistTaps="never"
          renderMessageText={renderMessageText}
          bottomOffset={insets.bottom - 10}
          messages={sortMessages()}
          messagesContainerStyle={{marginBottom: 10}}
          textInputProps={{lineHeight: null}}
          listViewProps={{marginBottom: 10}}
          renderActions={() => <CustomActions onPressCamera={onPressCamera} />}
          renderInputToolbar={props => (
            <CustomInputToolbar {...props} text={text} />
          )}
          renderBubble={props => {
            return (
              <Bubble
                {...props}
                textStyle={{
                  right: {
                    // fontFamily: 'Helvetica',
                  },
                  left: {
                    // fontFamily: 'Helvetica',
                  },
                }}
                wrapperStyle={{
                  left: {},
                  right: {
                    backgroundColor: colors.appBlue,
                  },
                }}
              />
            );
          }}
          user={{
            _id: profile.uid,
            name: profile.name,
            avatar: profile.avatar,
          }}
          scrollToBottom
          renderAvatar={renderAvatar}
          onSend={msgs => {
            const message: Message = {
              ...msgs[0],
              type: 'text',
              pending: true,
              createdAt: moment().valueOf(),
            };
            sendMessageAction({message, chatId, uid});
            ref.current?.scrollToEnd();
          }}
          inverted={false}
          onInputTextChanged={onInputTextChanged}
          text={text}
          renderMessageVideo={renderMessageVideo}
          renderSend={props => (
            <CustomSend
              {...props}
              onPressAttachment={onPressAttachment}
              onPressVoiceNotes={onPressVoiceNote}
            />
          )}
          alwaysShowSend
        />

        <AbsoluteSpinner loading={exercisesLoading} text="Fetching exercises" />
      </SafeAreaView>
      <SafeAreaView style={{flex: 0, backgroundColor: colors.appGrey}} />
    </>
  );
};

const mapStateToProps = (
  {profile, exercises, settings}: MyRootState,
  props: {
    route: RouteProp<StackParamList, 'Chat'>;
  },
) => ({
  profile: profile.profile,
  chatMessages: profile.chatMessages,
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
  setChatMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
