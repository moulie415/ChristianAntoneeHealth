import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import * as _ from 'lodash';
import React, {useEffect} from 'react';
import {FlatList, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import {RootState, StackParamList} from '../../../App';
import colors from '../../../constants/colors';
import {truncate} from '../../../helpers';
import {getSimplifiedTime} from '../../../helpers/profile';
import {getConnections} from '../../../reducers/profile';
import Message from '../../../types/Message';
import {Profile} from '../../../types/Shared';
import Avatar from '../../commons/Avatar';
import Divider from '../../commons/Divider';
import Header from '../../commons/Header';
import Text from '../../commons/Text';
import UnreadConnectionCount from '../../commons/unread/UnreadConnectionCount';
import { SafeAreaView } from 'react-native-safe-area-context';

export const sortConnections = (
  profiles: Profile[],
  messages: {[key: string]: {[key: string]: Message}},
  unread: {[key: string]: number} | undefined,
) => {
  return profiles.sort((a, b) => {
    const unreadA = unread?.[a.uid] || 0;
    const unreadB = unread?.[b.uid] || 0;
    const messagesA = Object.values(messages[a.uid] || {});
    const messagesB = Object.values(messages[b.uid] || {});
    const latestA = _.sortBy(messagesA, 'createdAt')?.[messagesA.length - 1]
      ?.createdAt;
    const latestB = _.sortBy(messagesB, 'createdAt')?.[messagesB.length - 1]
      ?.createdAt;
    if (unreadA !== unreadB) {
      return unreadB - unreadA;
    } else if (latestA !== latestB) {
      if (typeof latestB === 'number' && typeof latestA === 'number') {
        return latestB - latestA;
      }
      return latestB?.valueOf() - latestA?.valueOf();
    }
    return 0;
  });
};

const Connections: React.FC<{
  profile: Profile;
  connections: {[key: string]: Profile};
  getConnectionsAction: () => void;
  loading: boolean;
  navigation: NativeStackNavigationProp<StackParamList, 'Chat'>;
  messages: {[key: string]: {[key: string]: Message}};
  unread: {[key: string]: number} | undefined;
}> = ({
  connections,
  getConnectionsAction,
  loading,
  navigation,
  messages,
  profile,
  unread,
}) => {
  useEffect(() => {
    getConnectionsAction();
  }, [getConnectionsAction]);

  const getLastMessage = (
    uid: string,
  ): {preview: string; italicize?: boolean; createdAt?: number} => {
    const userMessages = messages[uid];
    if (userMessages) {
      const messagesArr = Object.values(userMessages);
      let message: Message = {
        text: '',
        createdAt: 0,
        type: 'text',
        _id: '',
        user: {_id: ''},
      };
      messagesArr.forEach(msg => {
        if (msg?.createdAt > message?.createdAt) {
          message = msg;
        }
      });
      let preview = '';

      const sender =
        message.user?._id === profile.uid ? 'You' : `${connections[uid].name}`;

      if (message.type === 'audio') {
        preview = `${sender} sent a voice note`;
      } else if (message.type === 'video') {
        preview = `${sender} sent a video`;
      } else if (message.type === 'image') {
        preview = `${sender} sent an image`;
      } else if (message.type === 'document') {
        preview = `${sender} sent a document`;
      } else {
        preview = message.text;
      }
      return {
        preview: truncate(preview, 35),
        italicize:
          message.system ||
          message.type === 'audio' ||
          message.type === 'video' ||
          message.type === 'document' ||
          message.type === 'image',
        createdAt: message?.createdAt as number,
      };
    }
    return {preview: 'Beginning of chat', italicize: true};
  };
  return (
    <View style={{flex: 1, backgroundColor: colors.appGrey}}>
      <SafeAreaView style={{flex: 1}}>
        <Header
          hasBack
          title="Messaging"
          // right={<AddConnectionButton navigation={navigation} />}
        />
        {Object.values(connections).length === 0 && (
          <Text
            style={{
              textAlign: 'center',
              padding: 20,
              color: colors.appWhite,
              fontSize: 20,
            }}>
            No friends yet, you should not be seeing this please contact support
            for help.
          </Text>
        )}
        <FlatList
          keyExtractor={item => item.uid}
          data={sortConnections(Object.values(connections), messages, unread)}
          renderItem={({item}) => {
            const {preview, createdAt, italicize} = getLastMessage(item.uid);
            return (
              <TouchableOpacity
                onPress={() => navigation.navigate('Chat', {uid: item.uid})}
                style={{
                  padding: 10,
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Avatar
                    src={item.avatar}
                    name={`${item.name} ${item.surname || ''}`}
                    size={40}
                    uid={item.uid}
                  />
                </View>
                <View style={{justifyContent: 'center', margin: 10, flex: 1}}>
                  <Text style={{fontWeight: 'bold', color: colors.appWhite}}>
                    {`${item.name} ${item.surname || ''}`}
                  </Text>
                  <Text
                    style={{
                      color: colors.appWhite,
                      fontSize: 12,
                      fontStyle: italicize ? 'italic' : 'normal',
                    }}>
                    {preview}
                  </Text>
                </View>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 10,
                      color: colors.appWhite,
                      marginBottom: 5,
                    }}>
                    {getSimplifiedTime(createdAt || 0)}
                  </Text>
                  <UnreadConnectionCount uid={item.uid} />
                </View>
              </TouchableOpacity>
            );
          }}
          ItemSeparatorComponent={() => <Divider style={{}} />}
        />
      </SafeAreaView>
    </View>
  );
};

const mapStateToProps = ({profile}: RootState) => ({
  profile: profile.profile,
  connections: profile.connections,
  loading: profile.loading,
  messages: profile.messages,
  unread: profile.profile.unread,
});

const mapDispatchToProps = {
  getConnectionsAction: getConnections,
};

export default connect(mapStateToProps, mapDispatchToProps)(Connections);
