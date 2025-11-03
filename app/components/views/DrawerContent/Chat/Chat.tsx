import { FontAwesome6 } from '@react-native-vector-icons/fontawesome6';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Clipboard from 'expo-clipboard';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import _ from 'lodash';
import moment from 'moment';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { FlatList, Image, TouchableOpacity, View } from 'react-native';
import {
  AvatarProps,
  Bubble,
  BubbleProps,
  Avatar as GiftedAvatar,
  GiftedChat,
  Message as GiftedMessage,
  IMessage,
  MessageAudioProps,
  MessageImageProps,
  MessageText,
  MessageTextProps,
  MessageVideoProps,
} from 'react-native-gifted-chat';
import ImageView from 'react-native-image-viewing';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Snackbar from 'react-native-snackbar';
import uuid from 'react-native-uuid';
import Video, { ResizeMode } from 'react-native-video';
import { connect } from 'react-redux';
import { RootState, StackParamList } from '../../../../App';
import colors from '../../../../constants/colors';
import { logError } from '../../../../helpers/error';
import useInit from '../../../../hooks/UseInit';
import { viewWorkout } from '../../../../reducers/exercises';
import {
  loadEarlierMessages,
  requestMessageDeletion,
  sendMessage,
  setChatMessage,
  setRead,
} from '../../../../reducers/profile';
import { SettingsState } from '../../../../reducers/settings';
import Message, { MessageType } from '../../../../types/Message';
import { Profile } from '../../../../types/Shared';
import AbsoluteSpinner from '../../../commons/AbsoluteSpinner';
import Avatar from '../../../commons/Avatar';
import Header from '../../../commons/Header';
import ChatActions from './ChatActions';
import CustomInputToolbar from './CustomInputToolbar';
import CustomSend from './CustomSend';
import DocumentMessage from './DocumentMessage';
import VoiceNotePlayer from './VoiceNotePlayer';

interface ChatProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Chat'>;
  route: RouteProp<StackParamList, 'Chat'>;
  profile: Profile;
  messagesObj: { [key: string]: Message };
  connection: Profile;
  chatId: string;
  sendMessageAction: ({
    message,
    chatId,
    uid,
    size,
  }: {
    message: Message;
    chatId: string;
    uid: string;
    size?: number | null;
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
  chatMessages: { [key: string]: string };
  setChatMessage: ({ uid, message }: { uid: string; message: string }) => void;
  requestMessageDeletion: ({
    chatId,
    messageId,
    message,
    uid,
  }: {
    chatId: string;
    messageId: string;
    message: Message;
    uid: string;
  }) => void;
  settings: SettingsState;
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
  requestMessageDeletion,
  settings,
}) => {
  const { uid } = route.params;
  const [text, setText] = useState('');
  const [initialized, setInitialized] = useState(false);

  const [showRecorder, setShowRecorder] = useState(false);

  const [isLoading, setLoading] = useState(false);

  const persistChat = useMemo(
    () =>
      _.debounce(t => {
        setChatMessageAction({ uid, message: t });
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

  const sorted = useMemo(() => {
    const messages = Object.values(messagesObj || {});
    return messages
      .sort((a, b) => (b?.createdAt as number) - (a?.createdAt as number))
      .map(message => {
        return {
          ...message,
          user: { ...message.user, avatar: message.user?.avatar || undefined },
        };
      });
  }, [messagesObj]);

  const images: { uri: string }[] = sorted
    .filter(msg => msg.image)
    .map(msg => ({ uri: msg.image || '' }))
    .reverse();

  const [imageIndex, setImageIndex] = useState(0);
  const [imagesVisible, setImagesVisible] = useState(false);

  const cursor = useRef(0);

  const loadEarlier = useCallback(async () => {
    const startAfter = sorted[sorted.length - 1]?.createdAt;
    if (cursor.current === startAfter || !startAfter) {
      return;
    }
    cursor.current = startAfter as number;
    loadEarlierMessagesAction({ chatId, uid, startAfter: Number(startAfter) });
  }, [sorted, chatId, uid, loadEarlierMessagesAction]);

  const insets = useSafeAreaInsets();

  const renderCustomView = (props: BubbleProps<Message>, context: any) => {
    switch (props.currentMessage?.type) {
      case 'document':
        return (
          <DocumentMessage
            {...props.currentMessage}
            onLongPress={() =>
              props.currentMessage && onLongPress(context, props.currentMessage)
            }
          />
        );
      default:
        return null;
    }
  };

  const renderMessageText = (props: MessageTextProps<Message>) => {
    switch (props.currentMessage?.type) {
      case 'text':
      case 'video':
      case 'image':
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
              left: { fontStyle: 'italic', fontFamily: 'normal' },
              right: { fontStyle: 'italic', fontFamily: 'normal' },
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
              name={`${connection.name} ${connection.surname || ''}`}
              src={connection.avatar}
              size={28}
              uid={connection.uid}
            />
          ) : null
        }
      />
    );
  };

  const renderMessageVideo = (
    props: MessageVideoProps<IMessage>,
    context: any,
  ) => {
    return (
      <TouchableOpacity
        onLongPress={() =>
          props.currentMessage && onLongPress(context, props.currentMessage)
        }
        disabled={props.currentMessage?.pending}
        onPress={() => {
          if (props.currentMessage) {
            navigation.navigate('VideoView', { message: props.currentMessage });
          }
        }}
        style={{
          position: 'relative',
          height: 150,
          width: 272,
          margin: 3,
          borderRadius: 15,
          overflow: 'hidden',
        }}
      >
        <Video
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            right: 0,
            height: 150,
            width: 272,
            borderRadius: 15,
          }}
          resizeMode={ResizeMode.COVER}
          paused
          source={{
            uri: props.currentMessage?.video || '',
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              width: 50,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.7)',
              borderRadius: 25,
            }}
          >
            <FontAwesome6
              iconStyle="solid"
              style={{ marginLeft: 3 }}
              name="play"
              color={colors.appWhite}
              size={25}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderMessageAudio = (props: MessageAudioProps<IMessage>) => {
    if (props.currentMessage) {
      return <VoiceNotePlayer message={props.currentMessage} />;
    }
    return null;
  };

  const renderMessageImage = (
    props: MessageImageProps<IMessage>,
    context: any,
  ) => {
    return (
      <TouchableOpacity
        onLongPress={() =>
          props.currentMessage && onLongPress(context, props.currentMessage)
        }
        onPress={() => {
          setImageIndex(
            images.findIndex(img => img.uri === props.currentMessage?.image),
          );
          setImagesVisible(true);
        }}
        disabled={props.currentMessage?.pending}
      >
        <Image
          style={{
            position: 'relative',
            height: 150,
            width: 250,
            margin: 3,
            borderRadius: 15,
          }}
          source={{ uri: props.currentMessage?.image }}
        />
      </TouchableOpacity>
    );
  };

  const handleResponse = (response: ImagePicker.ImagePickerResult) => {
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
        ...(type === 'image' ? { image: asset.uri } : {}),
        ...(type === 'video' ? { video: asset.uri } : {}),
        text: '',
        type,
        pending: true,
        createdAt: moment().valueOf(),
        mimeType: asset.type,
      };
      sendMessageAction({ message, chatId, uid });
    }
  };

  const ref = useRef<FlatList<IMessage>>(null);

  const onPressAttachment = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      quality: 0.8,
      allowsMultipleSelection: false,
      videoQuality: ImagePicker.UIImagePickerControllerQualityType.Medium,
      base64: false,
    });
    handleResponse(result);
  };

  const onPressVoiceNote = () => {
    setShowRecorder(true);
  };

  const onPressCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      allowsMultipleSelection: false,
    });
    handleResponse(result);
  };

  const onSendVoiceNote = (result: string) => {
    const message: Message = {
      user: {
        _id: profile.uid,
        name: profile.name,
        avatar: profile.avatar,
      },
      _id: uuid.v4() as string,
      audio: result,
      text: '',
      type: 'audio',
      pending: true,
      createdAt: moment().valueOf(),
    };
    sendMessageAction({ message, chatId, uid });
  };

  const onPressDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/*', 'text/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        const message: Message = {
          user: {
            _id: profile.uid,
            name: profile.name,
            avatar: profile.avatar,
          },
          _id: uuid.v4() as string,
          document: asset.uri,
          text: '',
          type: 'document',
          pending: true,
          createdAt: moment().valueOf(),
          mimeType: asset.mimeType || '',
          filename: asset.name || '',
        };

        sendMessageAction({ message, chatId, uid, size: asset.size });
      }
    } catch (e: any) {
      if (e?.code !== 'DOCUMENT_PICKER_CANCELED') {
        logError(e);
      }
    }
  };

  const onLongPress = (context: any, message: IMessage) => {
    const id = Object.keys(messagesObj).find(key => {
      const msg: Message = messagesObj[key];
      return msg._id === message._id;
    });

    const msg: Message = messagesObj[id || ''];
    const messageId = msg.id;
    const options = ['Cancel'];

    const copyText = 'Copy text';
    const deleteMessage = 'Delete message';
    if (message.user._id === profile.uid) {
      options.unshift(deleteMessage);
    }

    if (message.text) {
      options.unshift(copyText);
    }

    const cancelButtonIndex = options.length - 1;
    context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex: number) => {
        if (options[buttonIndex] === copyText) {
          await Clipboard.setStringAsync(message.text);
          Snackbar.show({ text: 'Text copied to clipboard' });
        } else if (options[buttonIndex] === deleteMessage && msg && messageId) {
          requestMessageDeletion({ chatId, message: msg, uid, messageId });
        }
      },
    );
  };

  return (
    <>
      <SafeAreaView style={{ backgroundColor: colors.appGrey, flex: 1 }}>
        <Header
          title={connection.name}
          hasBack
          right={
            <TouchableOpacity
              onPress={() => navigation.navigate('ViewProfile', { connection })}
            >
              <Avatar
                src={connection.avatar}
                name={`${connection.name} ${connection.surname || ''}`}
                uid={connection.uid}
              />
            </TouchableOpacity>
          }
        />
        <GiftedChat
          // @ts-ignore
          messageContainerRef={ref}
          renderCustomView={renderCustomView}
          isLoadingEarlier={loading}
          keyboardShouldPersistTaps="never"
          renderMessageText={renderMessageText}
          bottomOffset={insets.bottom - 10}
          messages={sorted}
          messagesContainerStyle={{ marginBottom: 10 }}
          textInputProps={{ lineHeight: null }}
          listViewProps={{
            marginBottom: 10,
            onEndReached: loadEarlier,
          }}
          renderInputToolbar={props => (
            <CustomInputToolbar
              {...props}
              text={text}
              showRecorder={showRecorder}
              onCloseRecorder={() => setShowRecorder(false)}
              onSendVoiceNote={onSendVoiceNote}
            />
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
            sendMessageAction({ message, chatId, uid });
          }}
          onInputTextChanged={onInputTextChanged}
          text={text}
          onLongPress={onLongPress}
          renderMessage={props => {
            const { key, ...rest } = props;
            return <GiftedMessage {...rest} key={key} />;
          }}
          renderMessageVideo={renderMessageVideo}
          renderMessageAudio={renderMessageAudio}
          renderMessageImage={renderMessageImage}
          renderActions={props => (
            <ChatActions
              {...props}
              onPressCamera={onPressCamera}
              disabled={settings.attachmentsDisabled}
            />
          )}
          renderSend={props => (
            <CustomSend
              {...props}
              onPressAttachment={onPressAttachment}
              onPressVoiceNote={onPressVoiceNote}
              onPressDocument={onPressDocument}
            />
          )}
          scrollToBottomComponent={() => (
            <FontAwesome6
              iconStyle="solid"
              name="chevron-down"
              size={20}
              color={colors.textGrey}
            />
          )}
          alwaysShowSend
        />
      </SafeAreaView>
      <ImageView
        images={images}
        imageIndex={imageIndex}
        visible={imagesVisible}
        onRequestClose={() => setImagesVisible(false)}
      />
      <AbsoluteSpinner loading={exercisesLoading || isLoading} />
    </>
  );
};

const mapStateToProps = (
  { profile, exercises, settings }: RootState,
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
  settings,
});

const mapDispatchToProps = {
  sendMessageAction: sendMessage,
  setReadAction: setRead,
  viewWorkoutAction: viewWorkout,
  loadEarlierMessages,
  setChatMessage,
  requestMessageDeletion,
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
