import { PayloadAction } from "@reduxjs/toolkit";
import { PaginationData } from "../../defs/defs";
import {
  all,
  call,
  CallEffect,
  put,
  PutEffect,
  takeLatest,
} from "redux-saga/effects";

import { PaginationAPIModel } from "../../models/references/ApiResult";
import { AnyAction } from "redux-saga";
import {
  createUnitFailure,
  createUnitSuccess,
  deleteUnitFailure,
  deleteUnitSuccess,
  loadAllUnitsFailure,
  loadAllUnitsSuccess,
  updateUnitFailure,
  updateUnitSuccess,
} from "./unit.action";
import { UNITS_ACTION_TYPES } from "./unit.types";
import { Unit } from "../../models/references/Unit";
import {
  createNewUnit,
  loadUnits,
  removeUnit,
  updateEditUnit,
} from "../../services/unit.service";

export function* loadAllUnits(
  action: PayloadAction<PaginationData>
): Generator<
  CallEffect<PaginationAPIModel<Unit>> | PutEffect<AnyAction>,
  void,
  PaginationAPIModel<Unit>
> {
  try {
    const { payload } = action;
    const units: PaginationAPIModel<Unit> = yield call(loadUnits, payload);

    yield put(
      loadAllUnitsSuccess({
        ...units,
        filterColumn: payload.filterColumn,
        filterOrder: payload.filterQuery,
        sortColumn: payload.sortColumn,
        sortOrder: payload.sortOrder,
        currentPage: payload.pageNumber,
      })
    );
  } catch (error) {
    yield put(loadAllUnitsFailure(error));
  }
}

export function* createUnit(
  action: PayloadAction<Unit>
): Generator<CallEffect | PutEffect<AnyAction>, void, boolean> {
  try {
    const { payload } = action;
    yield call(createNewUnit, payload);
    yield put(createUnitSuccess(true));
  } catch (error) {
    yield put(createUnitFailure(error));
  }
}

export function* updateUnit(
  action: PayloadAction<Unit>
): Generator<CallEffect | PutEffect<AnyAction>, void, void> {
  try {
    const { payload } = action;
    yield call(updateEditUnit, payload.id, payload);
    yield put(updateUnitSuccess(true));
  } catch (error) {
    yield put(updateUnitFailure(error));
  }
}

export function* deleteUnit(
  action: PayloadAction<number>
): Generator<CallEffect | PutEffect<AnyAction>, void, boolean> {
  try {
    const { payload } = action;
    const id = payload;
    yield call(removeUnit, id);
    yield put(deleteUnitSuccess(true));
  } catch (error) {
    yield put(deleteUnitFailure(error));
  }
}

export function* onLoadAllUnits() {
  yield takeLatest(UNITS_ACTION_TYPES.LOAD_ALL_UNITS_START, loadAllUnits);
}

function* onCreateUnit() {
  yield takeLatest(UNITS_ACTION_TYPES.CREATE_UNIT_START, createUnit);
}

function* onUpdateUnit() {
  yield takeLatest(UNITS_ACTION_TYPES.UPDATE_UNIT_START, updateUnit);
}

function* onDeleteUnit() {
  yield takeLatest(UNITS_ACTION_TYPES.DELETE_UNIT_START, deleteUnit);
}

export function* unitSagas() {
  yield all([
    call(onLoadAllUnits),
    call(onCreateUnit),
    call(onUpdateUnit),
    call(onDeleteUnit),
  ]);
}
