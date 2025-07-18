import {
  all,
  call,
  CallEffect,
  put,
  PutEffect,
  select,
  takeLatest,
} from "redux-saga/effects";

import { AnyAction } from "redux-saga";

import {
  loadAllBuyersFailure,
  loadAllBuyersSuccess,
  updateBuyerFailure,
  updateBuyerSuccess,
  deleteBuyerSuccess,
  deleteBuyerFailure,
  createBuyerFailure,
  createBuyerSuccess,
} from "./buyer.action";

import { BUYERS_ACTION_TYPES } from "./buyer.types";
import { PayloadAction } from "@reduxjs/toolkit";
import { PaginationData } from "../../defs/defs";
import { PaginationAPIModel } from "../../models/references/ApiResult";
import { Buyer } from "../../models/references/Buyer";
import {
  createNewBuyer,
  loadBuyers,
  removeBuyer,
  updateEditBuyer,
} from "../../services/buyerService";

export function* loadAllBuyers(
  action: PayloadAction<PaginationData>
): Generator<
  CallEffect<PaginationAPIModel<Buyer>> | PutEffect<AnyAction>,
  void,
  PaginationAPIModel<Buyer>
> {
  try {
    const { payload } = action;
    const buyers: PaginationAPIModel<Buyer> = yield call(loadBuyers, payload);

    yield put(
      loadAllBuyersSuccess({
        ...buyers,
        filterColumn: payload.filterColumn,
        filterOrder: payload.filterQuery,
        sortColumn: payload.sortColumn,
        sortOrder: payload.sortOrder,
        currentPage: payload.pageNumber,
      })
    );
  } catch (error) {
    yield put(loadAllBuyersFailure(error));
  }
}

export function* getPageData() {
  yield select((state) => state.countrty.PaginationAPIModel);
}

function* onLoadAllBuyers() {
  yield takeLatest(BUYERS_ACTION_TYPES.LOAD_ALL_BUYERS_START, loadAllBuyers);
}

export function* createBuyer(
  action: PayloadAction<Buyer>
): Generator<CallEffect | PutEffect<AnyAction>, void, boolean> {
  try {
    const { payload } = action;
    yield call(createNewBuyer, payload);
    yield put(createBuyerSuccess(true));
  } catch (error) {
    yield put(createBuyerFailure(error));
  }
}

export function* updateBuyer(
  action: PayloadAction<Buyer>
): Generator<CallEffect | PutEffect<AnyAction>, void, void> {
  try {
    const { payload } = action;
    yield call(updateEditBuyer, payload.buyerCode, payload);
    yield put(updateBuyerSuccess(true));
  } catch (error) {
    yield put(updateBuyerFailure(error));
  }
}

export function* deleteBuyer(
  action: PayloadAction<number>
): Generator<CallEffect | PutEffect<AnyAction>, void, boolean> {
  try {
    const { payload } = action;
    const buyerCode = payload;
    yield call(removeBuyer, buyerCode);
    yield put(deleteBuyerSuccess(true));
  } catch (error) {
    yield put(deleteBuyerFailure(error));
  }
}

function* onCreateBuyer() {
  yield takeLatest(BUYERS_ACTION_TYPES.CREATE_BUYER_START, createBuyer);
}

function* onUpdateBuyer() {
  yield takeLatest(BUYERS_ACTION_TYPES.UPDATE_BUYER_START, updateBuyer);
}

function* onDeleteBuyer() {
  yield takeLatest(BUYERS_ACTION_TYPES.DELETE_BUYER_START, deleteBuyer);
}

export function* buyerSagas() {
  yield all([
    call(onLoadAllBuyers),
    call(onCreateBuyer),
    call(onUpdateBuyer),
    call(onDeleteBuyer),
  ]);
}
