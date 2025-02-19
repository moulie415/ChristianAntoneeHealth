import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from 'react-native';
import ImageView from 'react-native-image-viewing';
import {ImageSource} from 'react-native-image-viewing/dist/@types';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StackParamList} from '../../App';
import colors from '../../constants/colors';
import Avatar from '../commons/Avatar';
import GoalSummaries from '../commons/GoalSummaries';
import Header from '../commons/Header';
import ProfileCharts from '../commons/ProfileCharts';
import Tile from '../commons/Tile';

const ViewProfile: React.FC<{
  route: RouteProp<StackParamList, 'ViewProfile'>;
  navigation: NativeStackNavigationProp<StackParamList, 'ViewProfile'>;
}> = ({route, navigation}) => {
  const {connection} = route.params;

  const [images, setImages] = useState<ImageSource[]>([]);
  const [photoVisible, setPhotoVisible] = useState(false);

  useEffect(() => {
    if (connection.avatar) {
      setImages([{uri: connection.avatar}]);
    }
  }, [connection.avatar]);

  return (
    <View style={{flex: 1, backgroundColor: colors.appGrey}}>
      <SafeAreaView>
        <Header hasBack />
        <ScrollView
          keyboardShouldPersistTaps="always"
          contentContainerStyle={{paddingBottom: 100}}>
          <View
            style={{
              marginBottom: 10,
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPressIn={() => setPhotoVisible(true)}
              disabled={!connection.avatar}
              onPress={() => {}}
              style={{
                width: 95,
                height: 95,
                borderRadius: 48,
                borderColor: colors.appWhite,
                borderWidth: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 10,
              }}>
              <Avatar
                name={`${connection.name} ${connection.surname || ''}`}
                src={connection.avatar}
                size={80}
                hideAdmin
                uid={connection.uid}
              />
            </TouchableOpacity>
          </View>
          <View style={{alignItems: 'center'}}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: colors.appWhite,
                textAlign: 'center',
              }}>
              {`${connection.name} ${connection.surname || ''}`}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 20,
            }}>
            <Tile
              style={{
                width: 100,
                height: 70,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: colors.appWhite,
                  textAlign: 'center',
                }}>
                {connection.weight}
                <Text style={{fontSize: 12}}> kg</Text>
              </Text>
              <Text style={{fontSize: 12, color: colors.appWhite}}>Weight</Text>
            </Tile>
            <Tile
              style={{
                width: 100,
                height: 70,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: colors.appWhite,
                  textAlign: 'center',
                }}>
                {connection.height}
                <Text style={{fontSize: 12}}> cm</Text>
              </Text>
              <Text style={{fontSize: 12, color: colors.appWhite}}>Height</Text>
            </Tile>
            <Tile
              style={{
                width: 100,
                height: 70,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: colors.appWhite,
                  textAlign: 'center',
                }}>
                {moment().diff(connection.dob, 'years')}
                <Text style={{fontSize: 12}}> y.o</Text>
              </Text>
              <Text style={{fontSize: 12, color: colors.appWhite}}>Age</Text>
            </Tile>
          </View>

          <GoalSummaries connection={connection} navigation={navigation} />

          <ProfileCharts
            weight={connection.weight || 0}
            height={connection.height || 0}
            bodyFatPercentage={connection.bodyFatPercentage}
            muscleMass={connection.muscleMass}
            boneMass={connection.boneMass}
            connection
          />
        </ScrollView>
      </SafeAreaView>
      <ImageView
        images={images}
        imageIndex={0}
        visible={photoVisible}
        onRequestClose={() => setPhotoVisible(false)}
      />
    </View>
  );
};

export default ViewProfile;
