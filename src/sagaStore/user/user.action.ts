import { User } from "../../models/register/User";
import { LoginRequest } from "../../models/login/loginRequest";
import { LoginResponse } from "../../models/login/loginResponse";
import { createAction } from "../../utils/reducer/reducer.utils";
import { USER_ACTION_TYPES } from "./user.types";

const signUpStart = (user: User) => {
  return createAction(USER_ACTION_TYPES.USER_REGISTER_START, user);
};

const signUpSuccess = (success: boolean) => {
  return createAction(USER_ACTION_TYPES.USER_REGISTER_SUCCESS, {
    success,
  });
};

const signUpFailed = (error: unknown) => {
  return createAction(USER_ACTION_TYPES.USER_REGISTER_FAILURE, error);
};

const signInStart = (user: LoginRequest) => {
  return createAction(USER_ACTION_TYPES.USER_SIGNIN_START, user);
};

const signInSuccess = (loggedInUser: LoginResponse) => {
  return createAction(USER_ACTION_TYPES.USER_SIGNIN_SUCCESS, {
    ...loggedInUser.data,
  });
};

const signInFailed = (error: unknown) => {
  return createAction(USER_ACTION_TYPES.USER_SIGNIN_FAILURE, error);
};

const signOutStart = () => {
  return createAction(USER_ACTION_TYPES.USER_SIGNOUT_START, null);
};

const signOutSuccess = () => {
  return createAction(USER_ACTION_TYPES.USER_SIGNOUT_SUCCESS, null);
};

const signOutFailed = (error: unknown) => {
  return createAction(USER_ACTION_TYPES.USER_SIGNOUT_FAILURE, error);
};

export {
  signUpStart,
  signUpSuccess,
  signUpFailed,
  signInStart,
  signInSuccess,
  signInFailed,
  signOutStart,
  signOutSuccess,
  signOutFailed,
};
