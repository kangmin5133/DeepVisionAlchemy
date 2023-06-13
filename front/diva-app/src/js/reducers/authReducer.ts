import { LOGIN, LOGOUT, RESTORE_SESSION, User, AuthActionTypes } from '../actions/authActions';

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null
};

const authReducer = (state = initialState, action: AuthActionTypes): AuthState => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload
      };
    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        user: null
      };
    case RESTORE_SESSION:
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      return {
        ...state,
        isLoggedIn: user !== null,
        user,
      };
    default:
      return state;
  }
};

export default authReducer;