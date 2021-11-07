import { useAtom } from 'jotai';
import { UserData } from '@stacks/auth';
import { userAtom } from '../../store/auth';

export function useUser() {
  const [user, setUser] = useAtom<UserData | undefined, UserData | undefined>(userAtom);
  return {
    user,
    profile: user?.profile,
    addresses: user?.profile?.stxAddress,
    setUser,
    isSignedIn: !!user,
  };
}
