import apis from '@/apis';
import { UserInfo } from '@/interface/user';
import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState<UserInfo | null>(null);
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const { data } = await apis.user.getUserInfoApi();
        setUser(data);
      } catch (error) {
        console.error(error);
      }
    };
    getUserInfo();
  }, []);

  return {
    user
  };
}
