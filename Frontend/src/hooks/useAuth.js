import { useGrindNextStore } from '../store/useGrindNextStore.js';

export default function useAuth() {
  const user = useGrindNextStore((state) => state.user);
  const profile = useGrindNextStore((state) => state.profile);
  const isAuthenticated = useGrindNextStore(
    (state) => state.isAuthenticated
  );
  const sessionChecked = useGrindNextStore(
    (state) => state.sessionChecked
  );
  const loading = useGrindNextStore(
    (state) => state.loading
  );
  const error = useGrindNextStore(
    (state) => state.error
  );

  const login = useGrindNextStore(
    (state) => state.login
  );
  const signup = useGrindNextStore(
    (state) => state.signup
  );
  const logout = useGrindNextStore(
    (state) => state.logout
  );

  return {
    user,
    profile,
    isAuthenticated,
    sessionChecked,
    loading,
    error,
    login,
    signup,
    logout,
  };
}