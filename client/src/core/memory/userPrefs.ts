// 清空用户偏好逻辑，保留基础导出
export type UserPrefsStore = {
  load(): any;
  save(prefs: any): void;
};

export const userPrefsStore: UserPrefsStore = {
  load() { return undefined; },
  save() {}
};