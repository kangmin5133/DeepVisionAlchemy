export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";

export interface User {
  email: string;
  name: string;
  social_id: string;
  user_id: string;
  provider: string;
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

export type AuthActionTypes = LoginAction | LogoutAction;