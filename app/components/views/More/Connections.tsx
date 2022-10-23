import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {MyRootState} from '../../../types/Shared';
import Profile from '../../../types/Profile';
import {getConnections} from '../../../actions/profile';
import Avatar from '../../commons/Avatar';
import {
  FlatList,
  ImageBackground,
  RefreshControl,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {StackParamList} from '../../../App';
import Text from '../../commons/Text';
import DevicePixels from '../../../helpers/DevicePixels';
import UnreadConnectionCount from '../../commons/unread/UnreadConnectionCount';
import Message from '../../../types/Message';
import {getSimplifiedTime} from '../../../helpers/profile';
import colors from '../../../constants/colors';
import {truncate} from '../../../helpers';
import ListItem from '../../commons/ListItem';
import Divider from '../../commons/Divider';
import Header from '../../commons/Header';
import AddConnectionButton from '../../commons/AddConnectionButton';
import FastImage from 'react-native-fast-image';

const getLastMessage = (
  messages: {[key: string]: {[key: string]: Message}},
  uid: string,
): {lastMessage: string; italicize?: boolean; createdAt?: number} => {
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
    return {
      lastMessage: message.text,
      italicize: message.system,
      createdAt: message.createdAt as number,
    };
  }
  return {lastMessage: 'Beginning of chat', italicize: true};
};

const Connections: React.FC<{
  profile: Profile;
  connections: {[key: string]: Profile};
  getConnectionsAction: () => void;
  loading: boolean;
  navigation: NativeStackNavigationProp<StackParamList, 'Chat'>;
  messages: {[key: string]: {[key: string]: Message}};
}> = ({connections, getConnectionsAction, loading, navigation, messages}) => {
  useEffect(() => {
    getConnectionsAction();
  }, [getConnectionsAction]);
  return (
    <View style={{flex: 1, backgroundColor: colors.appGrey}}>
      <SafeAreaView style={{flex: 1}}>
        <Header
          hasBack
          title="Friends"
          right={<AddConnectionButton navigation={navigation} />}
        />
        {Object.values(connections).length === 0 && (
          <Text
            style={{
              textAlign: 'center',
              padding: DevicePixels[20],
              color: colors.appWhite,
              fontSize: DevicePixels[20],
            }}>
            No friends yet, press the invite button in the top right to send a
            link.
          </Text>
        )}
        <FlatList
          contentContainerStyle={{flex: 1}}
          data={Object.values(connections)}
          renderItem={({item}) => {
            const {lastMessage, createdAt, italicize} = getLastMessage(
              messages,
              item.uid,
            );
            return (
              <TouchableOpacity
                onPress={() => navigation.navigate('Chat', {uid: item.uid})}
                style={{
                  padding: DevicePixels[10],
                  flexDirection: 'row',
                  backgroundColor: colors.borderColor,
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Avatar
                    src={item.avatar}
                    name={`${item.name} ${item.surname || ''}`}
                    size={DevicePixels[40]}
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
                      fontSize: DevicePixels[12],
                    }}>
                    {truncate(lastMessage, 35)}
                  </Text>
                </View>
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: DevicePixels[10],
                      color: colors.appWhite,
                      marginBottom: DevicePixels[5],
                      fontStyle: 'italic',
                    }}>
                    {getSimplifiedTime(createdAt)}
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
