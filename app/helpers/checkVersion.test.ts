import {getVersion} from 'react-native-device-info';
import {navigate} from '../RootNavigation';
import {checkVersion} from './checkVersion';
import {logError} from './error';

jest.mock('react-native-device-info', () => ({
  getVersion: jest.fn(),
}));

jest.mock('../RootNavigation', () => ({
  navigate: jest.fn(),
}));

jest.mock('./error', () => ({
  logError: jest.fn(),
}));

describe('checkVersion', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return early if no latestVersion is provided', () => {
    checkVersion();
    expect(getVersion).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('should return early if latestVersion is not a valid number', () => {
    checkVersion('invalid');
    expect(getVersion).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });

  it('should return early if current version is not a valid number', () => {
    (getVersion as jest.Mock).mockReturnValue('invalid');
    checkVersion('2.0');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('should navigate to UpdatePrompt if the current version is lower than the latestVersion', () => {
    (getVersion as jest.Mock).mockReturnValue('1.2.0');
    checkVersion('1.2.1');
    expect(navigate).toHaveBeenCalledWith('UpdatePrompt');

    (getVersion as jest.Mock).mockReturnValue('0.1.1');
    checkVersion('3.0.0');
    expect(navigate).toHaveBeenCalledWith('UpdatePrompt');

    (getVersion as jest.Mock).mockReturnValue('1.0.3');
    checkVersion('2.0');
    expect(navigate).toHaveBeenCalledWith('UpdatePrompt');
  });

  it('should not navigate if the current version is equal to or higher than the latestVersion', () => {
    (getVersion as jest.Mock).mockReturnValue('2.2.0');
    checkVersion('2.2.0');
    expect(navigate).not.toHaveBeenCalled();

    (getVersion as jest.Mock).mockReturnValue('3.2.0');
    checkVersion('1.0');
    expect(navigate).not.toHaveBeenCalled();
  });

  it('should log an error if an exception is thrown', () => {
    const error = new Error('Test error');
    (getVersion as jest.Mock).mockImplementation(() => {
      throw error;
    });

    checkVersion('2.0');
    expect(logError).toHaveBeenCalledWith(error);
  });
});
