import moment from 'moment';
import Message from '../../../types/Message';
import { Profile } from '../../../types/Shared';
import { sortConnections } from './Connections';

jest.mock('react-redux', () => {
  return {
    connect: () => jest.fn(),
    useDispatch: {
      withTypes: () => jest.fn(),
    },
    useSelector: {
      withTypes: () => jest.fn(),
    },
  };
});
jest.mock('@react-native-firebase/analytics', () => {});
jest.mock('@sentry/react-native', () => {});
jest.mock('react-native-in-app-review', () => {});
jest.mock('react-native-purchases', () => {});
jest.mock('@react-native-vector-icons/fontawesome6', () => {});
jest.mock('@kolking/react-native-avatar', () => {});
jest.mock('@react-navigation/core', () => {});
jest.mock('@react-navigation/native', () => ({
  createNavigationContainerRef: jest.fn(),
}));

const profile1 = {
  uid: '1',
} as Profile;

const profile2 = {
  uid: '2',
} as Profile;

const profile3 = {
  uid: '3',
} as Profile;

const unread: { [key: string]: number } = {
  '1': 3,
  '2': 7,
  '3': 3,
};

const messages: { [key: string]: { [key: string]: Message } } = {
  '1': {
    a: { createdAt: moment().subtract(5, 'minutes').unix() } as Message,
    b: { createdAt: moment().subtract(1, 'days').unix() } as Message,
  },
  '2': {
    a: { createdAt: moment().unix() } as Message,
  },
  '3': {
    a: { createdAt: moment().subtract(2, 'days').unix() } as Message,
    b: { createdAt: moment().subtract(3, 'minutes').unix() } as Message,
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
