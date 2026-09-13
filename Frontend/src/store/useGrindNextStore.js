import { create } from 'zustand';
import { authApi } from '../lib/authClient.js';
import { appAuthApi } from '../api/auth.api.js';
import { profileApi } from '../api/profile.api.js';
import { skillApi } from '../api/skill.api.js';
import { projectApi } from '../api/project.api.js';
import { achievementApi } from '../api/achievement.api.js';
import { activityApi } from '../api/activity.api.js';
import { collectibleApi } from '../api/collectible.api.js';
import { gamificationApi } from '../api/gamification.api.js';
import { emptyDashboard, emptyProfile } from '../data/mockData.js';
import { errorMessage } from '../lib/utils.js';

const initialGameState = {
  profile: emptyProfile,
  skills: [],
  projects: [],
  achievements: [],
  activity: [],
  collectibles: [],
  dashboard: emptyDashboard,
};

export const useGrindNextStore = create((set, get) => ({
  user: null,
  ...initialGameState,
  isAuthenticated: false,
  sessionChecked: false,
  loading: false,
  error: null,

  hydrate: async () => {
    if (get().sessionChecked) return;

    set({ loading: true, error: null });

    try {
      const result = await authApi.getSession();
      const user = result?.data?.user ?? result?.user ?? null;

      if (!user) {
        set({
          user: null,
          isAuthenticated: false,
          sessionChecked: true,
          ...initialGameState,
        });
        return;
      }

      set({ user, isAuthenticated: true });
      await get().refreshAll();
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        ...initialGameState,
      });
    } finally {
      set({ loading: false, sessionChecked: true });
    }
  },

  login: async ({ email, password }) => {
    set({ loading: true, error: null });

    try {
      const authResult = await authApi.signInEmail({ email, password });

      if (authResult?.error) {
        throw new Error(authResult.error.message || 'Login failed');
      }

      const me = await appAuthApi.me();

      set({
        user: me.user,
        profile: { ...emptyProfile, ...(me.profile || {}) },
        isAuthenticated: true,
        sessionChecked: true,
      });

      await get().refreshAll();
    } catch (error) {
      const message = errorMessage(error, 'Login failed.');
      set({ error: message, isAuthenticated: false });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signup: async ({ name, email, password }) => {
    set({ loading: true, error: null });

    try {
      const authResult = await authApi.signUpEmail({ name, email, password });

      if (authResult?.error) {
        throw new Error(authResult.error.message || 'Registration failed');
      }

      const me = await appAuthApi.me();

      set({
        user: me.user,
        profile: { ...emptyProfile, ...(me.profile || {}) },
        isAuthenticated: true,
        sessionChecked: true,
      });

      await get().refreshAll();
    } catch (error) {
      const message = errorMessage(error, 'Registration failed.');
      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await authApi.signOut();
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        sessionChecked: true,
        error: null,
        ...initialGameState,
      });
    }
  },

  refreshProfile: async () => {
    const response = await profileApi.getMe();
    const profile = response?.profile ?? response;

    set({ profile: { ...emptyProfile, ...profile } });
    return profile;
  },

  refreshOverview: async () => {
    const dashboard = await gamificationApi.overview();

    set({
      dashboard: { ...emptyDashboard, ...dashboard },
      profile: {
        ...emptyProfile,
        ...get().profile,
        ...(dashboard?.profile || {}),
      },
    });

    return dashboard;
  },

  refreshAll: async () => {
    try {
      const [
        profileResponse,
        skills,
        projects,
        achievements,
        activity,
        collectibles,
        dashboard,
      ] = await Promise.all([
        profileApi.getMe(),
        skillApi.list(),
        projectApi.list(),
        achievementApi.list(),
        activityApi.list(20),
        collectibleApi.mine(),
        gamificationApi.overview(),
      ]);

      const profile = profileResponse?.profile ?? profileResponse;

      set({
        profile: { ...emptyProfile, ...profile },
        skills: Array.isArray(skills) ? skills : [],
        projects: Array.isArray(projects) ? projects : [],
        achievements: Array.isArray(achievements) ? achievements : [],
        activity: Array.isArray(activity) ? activity : [],
        collectibles: Array.isArray(collectibles) ? collectibles : [],
        dashboard: { ...emptyDashboard, ...dashboard },
        error: null,
      });
    } catch (error) {
      set({ error: errorMessage(error, 'Unable to load your data.') });
    }
  },

  clearError: () => set({ error: null }),
}));
