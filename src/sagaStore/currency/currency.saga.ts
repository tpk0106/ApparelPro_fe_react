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
  loadAllCurrenciesFailure,
  loadAllCurrenciesSuccess,
  updateCurrencyFailure,
  updateCurrencySuccess,
  deleteCurrencySuccess,
  deleteCurrencyFailure,
  createCurrencyFailure,
  createCurrencySuccess,
} from "./currency.action";

import { CURRENCIES_ACTION_TYPES } from "./currency.types";
import { PayloadAction } from "@reduxjs/toolkit";
import { PaginationData } from "../../defs/defs";
import { PaginationAPIModel } from "../../models/references/ApiResult";
import { Currency } from "../../models/references/Currency";
import {
  loadCurrencies,
  updateEditCurrency,
  removeCurrency,
  createNewCurrency,
} from "../../services/currency.service";

export function* loadAllCurrencies(
  action: PayloadAction<PaginationData>
): Generator<
  CallEffect<PaginationAPIModel<Currency>> | PutEffect<AnyAction>,
  void,
  PaginationAPIModel<Currency>
> {
  try {
    const { payload } = action;
    const countries: PaginationAPIModel<Currency> = yield call(
      loadCurrencies,
      payload
    );

    yield put(
      loadAllCurrenciesSuccess({
        ...countries,
        filterColumn: payload.filterColumn,
        filterOrder: payload.filterQuery,
        sortColumn: payload.sortColumn,
        sortOrder: payload.sortOrder,
        currentPage: payload.pageNumber,
      })
    );
  } catch (error) {
    yield put(loadAllCurrenciesFailure(error));
  }
}

export function* getPageData() {
  yield select((state) => state.countrty.PaginationAPIModel);
}

function* onLoadAllCurrencies() {
  yield takeLatest(
    CURRENCIES_ACTION_TYPES.LOAD_ALL_CURRENCIES_START,
    loadAllCurrencies
  );
}

export function* createCurrency(
  action: PayloadAction<Currency>
): Generator<CallEffect | PutEffect<AnyAction>, void, boolean> {
  try {
    const { payload } = action;
    yield call(createNewCurrency, payload);
    yield put(createCurrencySuccess(true));
  } catch (error) {
    yield put(createCurrencyFailure(error));
  }
}

export function* updateCurrency(
  action: PayloadAction<Currency>
): Generator<CallEffect | PutEffect<AnyAction>, void, void> {
  try {
    const { payload } = action;
    yield call(updateEditCurrency, payload.code, payload);

    yield put(updateCurrencySuccess(true));
  } catch (error) {
    yield put(updateCurrencyFailure(error));
  }
}

export function* deleteCurrency(
  action: PayloadAction<string>
): Generator<CallEffect | PutEffect<AnyAction>, void, boolean> {
  try {
    const code = action.payload;
    yield call(removeCurrency, code);

    yield put(deleteCurrencySuccess(true));
  } catch (error) {
    yield put(deleteCurrencyFailure(error));
  }
}

function* onCreateCurrency() {
  yield takeLatest(
    CURRENCIES_ACTION_TYPES.CREATE_CURRENCY_START,
    createCurrency
  );
}

function* onUpdateCurrency() {
  yield takeLatest(
    CURRENCIES_ACTION_TYPES.UPDATE_CURRENCY_START,
    updateCurrency
  );
}

function* onDeleteCurrency() {
  yield takeLatest(
    CURRENCIES_ACTION_TYPES.DELETE_CURRENCY_START,
    deleteCurrency
  );
}

export function* currencySagas() {
  yield all([
    call(onLoadAllCurrencies),
    call(onCreateCurrency),
    call(onUpdateCurrency),
    call(onDeleteCurrency),
  ]);
}
