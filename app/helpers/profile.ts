import Purchases from 'react-native-purchases';
import moment from 'moment';

export const setUserAttributes = (attributes: {[key: string]: string}) => {
  Purchases.setAttributes(attributes);
};

export const getSimplifiedTime = (createdAt: number) => {
  const timeStamp = new Date(createdAt);
  let dateString;
  const now = new Date();
  const today0 = new Date();
  const yesterday0 = new Date(today0.setHours(0, 0, 0, 0));
  yesterday0.setDate(today0.getDate() - 1);

  if (timeStamp < yesterday0) {
    dateString = timeStamp.toDateString();
  } else if (timeStamp < today0) {
    dateString = 'Yesterday';
  } else {
    const minsBeforeNow = Math.floor(
      (now.getTime() - timeStamp.getTime()) / (1000 * 60),
    );
    const hoursBeforeNow = Math.floor(minsBeforeNow / 60);
    if (hoursBeforeNow > 0) {
      dateString = `${hoursBeforeNow} ${
        hoursBeforeNow === 1 ? 'hour' : 'hours'
      } ago`;
    } else if (minsBeforeNow > 0) {
      dateString = `${minsBeforeNow} ${
        minsBeforeNow === 1 ? 'min' : 'mins'
      } ago`;
    } else {
      dateString = 'Just Now';
    }
  }
  return dateString;
};
