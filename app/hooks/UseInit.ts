import {useEffect} from 'react';

const useInit = (func: () => void) => {
  useEffect(() => {
    if (func && typeof func === 'function') {
      func();
    }
  }, []);
};

export default useInit;
