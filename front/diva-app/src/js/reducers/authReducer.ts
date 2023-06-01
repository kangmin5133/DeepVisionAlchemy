import { LOGIN, LOGOUT, User, AuthActionTypes } from '../actions/authActions';

interface AuthState {
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
    default:
      return state;
  }
};

export default authReducer;