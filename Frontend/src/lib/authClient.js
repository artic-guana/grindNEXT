import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

export const authApi = {
  signUpEmail: (payload) => authClient.signUp.email(payload),
  signInEmail: (payload) => authClient.signIn.email(payload),
  signOut: () => authClient.signOut(),
  getSession: () => authClient.getSession(),
};
