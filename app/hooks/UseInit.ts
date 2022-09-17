import {useEffect} from 'react';

const useInit = (func: () => void) => {
  useEffect(() => {
    if (func && typeof func === 'function') {
      return func();
    }
    return null;
  }, []);
};

export default useInit;
