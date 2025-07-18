import { USER_ACTION_TYPES } from "./user.types";

const INITIAL_STATE = {
  currentUser: null,
  success: false,
  isLoading: false,
  error: null,
};

export const userReducer = (state = INITIAL_STATE, action: any) => {
  const { type, payload } = action;

  switch (type) {
    case USER_ACTION_TYPES.USER_REGISTER_SUCCESS:
      return { ...state, success: true, isLoading: false };

    case USER_ACTION_TYPES.USER_SIGNIN_SUCCESS:
      return {
        ...state,
        currentUser: { ...payload },
        error: null,
        success: true,
        isLoading: false,
      };
    case USER_ACTION_TYPES.USER_SIGNOUT_START:
      return { ...state, currentUser: null, isLoading: true };

    case USER_ACTION_TYPES.USER_SIGNOUT_SUCCESS:
      return { ...state, isLoading: false, success: true, currentUser: null };

    // https://react.dev/learn/extracting-state-logic-into-a-reducer
    case USER_ACTION_TYPES.USER_SIGNIN_FAILURE:
    case USER_ACTION_TYPES.USER_SIGNOUT_FAILURE:
    case USER_ACTION_TYPES.USER_REGISTER_FAILURE:
      return {
        ...state,
        error: payload.response.data,
        isLoading: false,
        success: false,
      };

    default:
      return state;
  }
};
