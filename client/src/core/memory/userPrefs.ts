export type UserPrefsStore = {
  load(): { preferredStyle?: string; preferredCameraView?: string; negativesForSD?: string[] } | undefined;
  save(prefs: { preferredStyle?: string; preferredCameraView?: string; negativesForSD?: string[] }): void;
};

const KEY = 'rio_user_prefs_v1';

export const userPrefsStore: UserPrefsStore = {
  load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : undefined;
    } catch {
      return undefined;
    }
  },
  save(prefs) {
    try {
      localStorage.setItem(KEY, JSON.stringify(prefs));
    } catch {
      // ignore
    }
  }
};
