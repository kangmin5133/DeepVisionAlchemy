export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const RESTORE_SESSION = "RESTORE_SESSION";

export interface User {
  email: string;
  name: string;
  social_id: string;
  user_id: number;
  org_id?: number;
  provider: string;
  profile_image? : string;
}

interface RestoreSessionAction {
  type: typeof RESTORE_SESSION;
}

interface LoginAction {
  type: typeof LOGIN;
  payload: User;
}

interface LogoutAction {
  type: typeof LOGOUT;
}

export const login = (userData: User): LoginAction => ({
  type: LOGIN,
  payload: userData,
});

export const logout = (): LogoutAction => ({
  type: LOGOUT,
});

export const restoreSession = (): RestoreSessionAction => ({
  type: RESTORE_SESSION,
});

export type AuthActionTypes = LoginAction | LogoutAction | RestoreSessionAction;