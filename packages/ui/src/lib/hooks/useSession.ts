import { setAuth, setUser } from '@/store/app';
import { setFetchingGroups, setGroups } from '@/store/groups';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { httpGet } from '../request';

const useSession = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const getSession = async () => {
    setLoading(true);
    const response = await httpGet('/session');
    if (response) {
      dispatch(setAuth(true));
      dispatch(setUser(response.data));
    }
    setLoading(false);
  };

  const getGroups = async () => {
    dispatch(setFetchingGroups(true));
    const response = await httpGet('/group/list');
    dispatch(setFetchingGroups(false));
    if (response) dispatch(setGroups(response.data || []));
  };

  const setInitialSession = async () => {
    await getSession();
    await getGroups();
    setLoading(false);
  };

  return { setInitialSession, setLoading, loading };
};

export default useSession;
