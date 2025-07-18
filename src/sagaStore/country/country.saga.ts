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
  loadAllCountriesFailure,
  loadAllCountriesSuccess,
  updateCountryFailure,
  updateCountrySuccess,
  deleteCountrySuccess,
  deleteCountryFailure,
  createCountryFailure,
  createCountrySuccess,
} from "./country.action";

import { COUNTRIES_ACTION_TYPES } from "./country.types";
import { PayloadAction } from "@reduxjs/toolkit";
import { PaginationData } from "../../defs/defs";
import { PaginationAPIModel } from "../../models/references/ApiResult";
import { Country } from "../../models/references/Country";
import {
  loadCountries,
  updateEditCountry,
  removeCountry,
  createNewCountry,
} from "../../services/country.service";

export function* loadAllCountries(
  action: PayloadAction<PaginationData>
): Generator<
  CallEffect<PaginationAPIModel<Country>> | PutEffect<AnyAction>,
  void,
  PaginationAPIModel<Country>
> {
  try {
    const { payload } = action;
    const countries: PaginationAPIModel<Country> = yield call(
      loadCountries,
      payload
    );

    yield put(
      loadAllCountriesSuccess({
        ...countries,
        filterColumn: payload.filterColumn,
        filterOrder: payload.filterQuery,
        sortColumn: payload.sortColumn,
        sortOrder: payload.sortOrder,
        currentPage: payload.pageNumber,
      })
    );
  } catch (error) {
    yield put(loadAllCountriesFailure(error));
  }
}

export function* getPageData() {
  yield select((state) => state.countrty.PaginationAPIModel);
}

function* onLoadAllCountries() {
  yield takeLatest(
    COUNTRIES_ACTION_TYPES.LOAD_ALL_COUNTRIES_START,
    loadAllCountries
  );
}

export function* createCountry(
  action: PayloadAction<Country>
): Generator<CallEffect | PutEffect<AnyAction>, void, boolean> {
  try {
    const { payload } = action;
    yield call(createNewCountry, payload);
    yield put(createCountrySuccess(true));
  } catch (error) {
    yield put(createCountryFailure(error));
  }
}

export function* updateCountry(
  action: PayloadAction<Country>
): Generator<CallEffect | PutEffect<AnyAction>, void, void> {
  try {
    const { payload } = action;
    yield call(updateEditCountry, payload.code, payload);

    yield put(updateCountrySuccess(true));
  } catch (error) {
    yield put(updateCountryFailure(error));
  }
}

export function* deleteCountry(
  action: PayloadAction<string>
): Generator<CallEffect | PutEffect<AnyAction>, void, boolean> {
  try {
    const code = action.payload;
    yield call(removeCountry, code);

    yield put(deleteCountrySuccess(true));
  } catch (error) {
    yield put(deleteCountryFailure(error));
  }
}

function* onCreateCountry() {
  yield takeLatest(COUNTRIES_ACTION_TYPES.CREATE_COUNTRY_START, createCountry);
}

function* onUpdateCountry() {
  yield takeLatest(COUNTRIES_ACTION_TYPES.UPDATE_COUNTRY_START, updateCountry);
}

function* onDeleteCountry() {
  yield takeLatest(COUNTRIES_ACTION_TYPES.DELETE_COUNTRY_START, deleteCountry);
}

export function* countrySagas() {
  yield all([
    call(onLoadAllCountries),
    call(onCreateCountry),
    call(onUpdateCountry),
    call(onDeleteCountry),
  ]);
}
