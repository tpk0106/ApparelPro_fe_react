import { Action, AnyAction, PayloadAction } from "@reduxjs/toolkit";
import { CreatePortDestinationAPIModel, PaginationData } from "../../defs/defs";
import { PortDestination } from "../../models/references/PortDestination";
import { PaginationAPIModel } from "../../models/references/ApiResult";
import {
  all,
  call,
  CallEffect,
  put,
  PutEffect,
  takeLatest,
} from "redux-saga/effects";
import { PORT_DESTINATION_ACTION_TYPES } from "./port-destination.types";
import {
  createPortDestinationFailure,
  createPortDestinationsSuccess,
  deletePortDestinationFailure,
  deletePortDestinationSuccess,
  loadAllPortDestinationsFailure,
  loadAllPortDestinationsSuccess,
  updatePortDestinationFailure,
  updatePortDestinationSuccess,
} from "./port-destination.action";
import {
  createNewPortDestination,
  loadPortDestinations,
  removePortDestination,
  updateEditPortDestination,
} from "../../services/port-destination.service";

export function* loadAllPortDestinations(
  action: PayloadAction<PaginationData>
): Generator<
  CallEffect<PaginationAPIModel<PortDestination>> | PutEffect<AnyAction>,
  void,
  PaginationAPIModel<PortDestination>
> {
  try {
    const { payload } = action;
    const portDestinations: PaginationAPIModel<PortDestination> = yield call(
      loadPortDestinations,
      payload
    );

    yield put(
      loadAllPortDestinationsSuccess({
        ...portDestinations,
        filterColumn: payload.filterColumn,
        filterOrder: payload.filterQuery,
        sortColumn: payload.sortColumn,
        sortOrder: payload.sortOrder,
        currentPage: payload.pageNumber,
      })
    );
  } catch (error) {
    yield put(loadAllPortDestinationsFailure(error));
  }
}

export function* createPortDestination(
  action: PayloadAction<CreatePortDestinationAPIModel>
): Generator<CallEffect | PutEffect<Action>, void, boolean> {
  try {
    const { payload } = action;
    yield call(createNewPortDestination, payload);

    yield put(createPortDestinationsSuccess(true));
  } catch (error) {
    yield put(createPortDestinationFailure(error));
  }
}

export function* onloadAllPortDestinations() {
  yield takeLatest(
    PORT_DESTINATION_ACTION_TYPES.LOAD_ALL_PORT_DESTINATIONS_START,
    loadAllPortDestinations
  );
}

export function* onCreatePortDestination() {
  yield takeLatest(
    PORT_DESTINATION_ACTION_TYPES.CREATE_PORT_DESTINATION_START,
    createPortDestination
  );
}

export function* updatePortDestination(
  action: PayloadAction<PortDestination>
): Generator<CallEffect | PutEffect<Action>, void, void> {
  try {
    const { payload } = action;
    yield call(
      updateEditPortDestination,
      payload.id,
      payload.countryCode,
      payload
    );

    yield put(updatePortDestinationSuccess(true));
  } catch (error) {
    yield put(updatePortDestinationFailure(error));
  }
}

export function* onUpdatePortDestination() {
  yield takeLatest(
    PORT_DESTINATION_ACTION_TYPES.UPDATE_PORT_DESTINATION_START,
    updatePortDestination
  );
}

type deletePortDestinationPara = {
  id: number;
  countryCode: string;
};

export function* deletePortDestination(
  action: PayloadAction<deletePortDestinationPara>
): Generator<CallEffect | PutEffect<Action>, void, boolean> {
  try {
    const { id, countryCode } = action.payload;
    yield call(removePortDestination, id, countryCode);

    yield put(deletePortDestinationSuccess(true));
  } catch (error) {
    yield put(deletePortDestinationFailure(error));
  }
}

export function* onDeletePortDestination() {
  yield takeLatest(
    PORT_DESTINATION_ACTION_TYPES.DELETE_PORT_DESTINATION_START,
    deletePortDestination
  );
}

export function* portDestinationSagas() {
  yield all([
    call(onloadAllPortDestinations),
    call(onCreatePortDestination),
    call(onUpdatePortDestination),
    call(onDeletePortDestination),
  ]);
}
