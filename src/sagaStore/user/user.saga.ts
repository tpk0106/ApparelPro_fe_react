import {
  all,
  call,
  CallEffect,
  put,
  PutEffect,
  takeLatest,
} from "redux-saga/effects";
import { AnyAction } from "redux-saga";
import { PayloadAction } from "@reduxjs/toolkit";

import { login, register, logOut } from "../../services/userService";
import { LoginRequest } from "../../models/login/loginRequest";
import {
  signUpFailed,
  signUpSuccess,
  signInFailed,
  signInSuccess,
  signOutSuccess,
  signOutFailed,
} from "./user.action";
import { USER_ACTION_TYPES } from "./user.types";
import { LoginResponse } from "../../models/login/loginResponse";
import { User } from "../../models/register/User";

export function* signUpUser(
  action: PayloadAction<User>
): Generator<CallEffect<User> | PutEffect<AnyAction>, void, User> {
  try {
    const { payload } = action;
    yield call(register, payload);
    yield put(signUpSuccess(true));
  } catch (error) {
    yield put(signUpFailed(error));
  }
}

const tokenKey: string = "token";
const refreshTokenKey: string = "refreshToken";
const userKey: string = "user";

export function* signInUser(
  action: PayloadAction<LoginRequest>
): Generator<
  CallEffect<LoginRequest> | PutEffect<AnyAction>,
  void,
  LoginResponse
> {
  try {
    const { payload } = action;
    const user: LoginResponse = yield call(login, payload);
    const { token, refreshToken, knownAs } = user.data;

    localStorage.setItem(tokenKey, token);
    localStorage.setItem(refreshTokenKey, refreshToken);
    localStorage.setItem(userKey, knownAs);

    yield put(signInSuccess(user));
  } catch (error: any) {
    yield put(signInFailed(error));
  }
}

export function* signOutUser(): Generator<
  CallEffect<boolean> | PutEffect<AnyAction>,
  void,
  boolean
> {
  try {
    yield call(logOut);
    yield put(signOutSuccess());
  } catch (error) {
    yield put(signOutFailed(error));
  }
}

export function* onSignUpStart() {
  yield takeLatest(USER_ACTION_TYPES.USER_REGISTER_START, signUpUser);
}

export function* onSignInStart() {
  yield takeLatest(USER_ACTION_TYPES.USER_SIGNIN_START, signInUser);
}

export function* onSignOutStart() {
  yield takeLatest(USER_ACTION_TYPES.USER_SIGNOUT_START, signOutUser);
}

// https://stackoverflow.com/questions/53071610/yield-all-in-saga-is-not-waiting-for-all-the-effects-to-complete

export function* userSagas() {
  yield all([call(onSignUpStart), call(onSignInStart), call(onSignOutStart)]);
}

// function* call(login: (credentials: LoginRequest) => Promise<any>, loginRequest: LoginRequest): LoginRequest {
//   throw new Error("Function not implemented.");
// }
