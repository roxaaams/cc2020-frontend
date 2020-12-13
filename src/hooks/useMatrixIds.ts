import {
  useState,
  useEffect,
  useCallback,
} from 'react';

export const useMatrixIds = (): [string[] | undefined, boolean, () => Promise<void>] => {
  const [ids, setIds] = useState<string[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const refresh = useCallback(
    async () => {
      setLoading(true);
      setIds(await fetch('/ids').then((data) => data.json()));
      setLoading(false);
    },
    [setIds],
  );
  const [initialLoad, setInitialLoad] = useState<boolean>(false);
  useEffect(
    () => {
      if (!initialLoad) {
        setInitialLoad(true);
        refresh();
      }
    },
    [refresh, initialLoad, setInitialLoad],
  );
  return [ids, loading, refresh];
};

export default useMatrixIds;
