import {
  call,
  CallEffect,
  put,
  all,
  takeLatest,
  PutEffect,
} from "redux-saga/effects";
import { AnyAction } from "redux-saga";

import { PayloadAction } from "@reduxjs/toolkit";

import Bank from "../../models/references/Bank";

import {
  createBankFailure,
  createBankSuccess,
  loadAllBanksFailed,
  loadAllBanksSuccess,
  updateBankFailure,
  updateBankSuccess,
} from "./bank.action";
import {
  loadBanks,
  createNewBank,
  deleteBank,
  updateEditBank,
} from "../../services/bank.service";
import { PaginationData } from "../../defs/defs";
import { PaginationAPIModel } from "../../models/references/ApiResult";
import { BANK_ACTION_TYPES } from "./bank.types";

export function* LoadAllBanks(
  action: PayloadAction<PaginationData>
): Generator<
  CallEffect<PaginationAPIModel<Bank>> | PutEffect<AnyAction>,
  void,
  PaginationAPIModel<Bank>
> {
  try {
    const { payload } = action;

    const data: PaginationAPIModel<Bank> = yield call(loadBanks, payload);

    yield put(loadAllBanksSuccess(data));
  } catch (error) {
    yield put(loadAllBanksFailed(error));
  }
}

export function* createBank(
  action: PayloadAction<Bank>
): Generator<CallEffect | PutEffect<AnyAction>, void, boolean> {
  try {
    const { payload } = action;
    yield call(createNewBank, payload);
    yield put(createBankSuccess(true));
  } catch (error) {
    yield put(createBankFailure(error));
  }
}

export function* updateBank(
  action: PayloadAction<Bank>
): Generator<CallEffect | PutEffect<AnyAction>, void, void> {
  try {
    const { payload } = action;
    yield call(updateEditBank, payload.bankCode, payload);

    yield put(updateBankSuccess(true));
  } catch (error) {
    yield put(updateBankFailure(error));
  }
}

function* onLoadAllBanks() {
  yield takeLatest(BANK_ACTION_TYPES.LOAD_ALL_BANKS_START, LoadAllBanks);
}

function* onCreateBank() {
  yield takeLatest(BANK_ACTION_TYPES.CREATE_BANK_START, createBank);
}

function* onUpdateBank() {
  yield takeLatest(BANK_ACTION_TYPES.UPDATE_BANK_START, updateBank);
}

export function* bankSagas() {
  yield all([call(onLoadAllBanks), call(onCreateBank), call(onUpdateBank)]);
}
