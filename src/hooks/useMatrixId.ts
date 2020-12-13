import {
  useState,
  useCallback,
  useEffect,
} from 'react';

export const useMatrixId = (ids: string[] | undefined) => {
  const [value, setValue] = useState<string>('');
  const onChange = useCallback(
    ({ target: { value: val } }) => {
      if (!ids || ids.length === 0 || !ids.includes(val)) {
        return undefined;
      }
      setValue(val);
      return undefined;
    },
    [setValue, ids],
  );
  useEffect(
    () => {
      setValue('');
    },
    [setValue, ids],
  );
  return { value, onChange };
};

export default useMatrixId;
