import {useEffect} from 'react';

const useInit = (callback: () => void) => {
  useEffect(() => {
    return callback;
  }, []);
};

export default useInit;
