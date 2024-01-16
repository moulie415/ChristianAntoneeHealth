import Message from '../../../types/Message';
import Profile from '../../../types/Profile';
import {sortConnections} from './Connections';

jest.mock('react-redux', () => {
  return {
    connect: () => jest.fn(),
  };
});
jest.mock('react-native-push-notification', () => {});
jest.mock('@react-native-firebase/analytics', () => {});
jest.mock('@sentry/react-native', () => {});
jest.mock('react-native-in-app-review', () => {});
jest.mock('react-native-purchases', () => {});
jest.mock('react-native-vector-icons/FontAwesome6', () => {});

const profile1 = {
  uid: '1',
} as Profile;

const profile2 = {
  uid: '2',
} as Profile;

const profile3 = {
  uid: '3',
} as Profile;

const unread: {[key: string]: number} = {
  '1': 3,
  '2': 7,
  '3': 3,
};

const messages: {[key: string]: {[key: string]: Message}} = {
  '1': {
    a: {} as Message,
    b: {createdAt: 5} as Message,
  },
  '2': {
    a: {} as Message,
    b: {createdAt: 5} as Message,
  },
  '3': {
    a: {} as Message,
    b: {createdAt: 10} as Message,
  },
};

const profiles = [profile1, profile2, profile3];

describe('Connections component', () => {
  it('Should sort the connections correctly', () => {
    expect(sortConnections(profiles, messages, unread)).toEqual([
      profile2,
      profile3,
      profile1,
    ]);
  });
});
