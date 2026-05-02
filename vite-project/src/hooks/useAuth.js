import { useAuthStore } from '../stores/authStore';
export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const setUser = useAuthStore((state) => state.setUser);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return {
    user,
    token,
    login,
    logout,
    setUser,
    isAuthenticated: isAuthenticated(),
  };
};

export default useAuth;
