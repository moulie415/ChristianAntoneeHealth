import React, {FunctionComponent} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Image from 'react-native-fast-image';
import styles from '../../styles/views/Profile';
import ProfileProps from '../../types/views/Profile';
import {connect} from 'react-redux';
import {MyRootState} from '../../types/Shared';

const Profile: FunctionComponent<ProfileProps> = ({profile}) => {
  return (
    <View style={styles.titleContainer}>
      <Text style={styles.title}>My Profile</Text>
      <TouchableOpacity>
        <Image source={{uri: profile.avatar}} style={styles.avatar} />
      </TouchableOpacity>
    </View>
  );
};

const mapStateToProps = ({profile}: MyRootState) => ({
  profile: profile.profile,
});

export default connect(mapStateToProps)(Profile);
