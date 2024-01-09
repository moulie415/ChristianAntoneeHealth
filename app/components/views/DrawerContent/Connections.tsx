import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React, {useEffect} from 'react';
import {FlatList, SafeAreaView, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import {StackParamList} from '../../../App';
import Profile from '../../../types/Profile';
import {MyRootState} from '../../../types/Shared';
import Avatar from '../../commons/Avatar';
import Text from '../../commons/Text';

import colors from '../../../constants/colors';
import {truncate} from '../../../helpers';
import {getSimplifiedTime} from '../../../helpers/profile';
import {getConnections} from '../../../reducers/profile';
import Message from '../../../types/Message';
import Divider from '../../commons/Divider';
import Header from '../../commons/Header';
import UnreadConnectionCount from '../../commons/unread/UnreadConnectionCount';

const Connections: React.FC<{
  profile: Profile;
  connections: {[key: string]: Profile};
  getConnectionsAction: () => void;
  loading: boolean;
  navigation: NativeStackNavigationProp<StackParamList, 'Chat'>;
  messages: {[key: string]: {[key: string]: Message}};
}> = ({
  connections,
  getConnectionsAction,
  loading,
  navigation,
  messages,
  profile,
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
        if (msg.createdAt > message.createdAt) {
          message = msg;
        }
      });
      let preview = '';

      const sender =
        message.user._id === profile.uid ? 'You' : `${connections[uid].name}`;

      if (message.type === 'audio') {
        preview = `${sender} sent a voice note`;
      } else if (message.type === 'video') {
        preview = `${sender} sent a video`;
      } else if (message.type === 'image') {
        preview = `${sender} sent an image`;
      } else {
        preview = message.text;
      }
      return {
        preview: truncate(preview, 35),
        italicize:
          message.system ||
          message.type === 'audio' ||
          message.type === 'video' ||
          message.type === 'image',
        createdAt: message.createdAt as number,
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
          data={Object.values(connections)}
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

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
  connections: profile.connections,
  loading: profile.loading,
  messages: profile.messages,
});

const mapDispatchToProps = {
  getConnectionsAction: getConnections,
};

export default connect(mapStateToProps, mapDispatchToProps)(Connections);
