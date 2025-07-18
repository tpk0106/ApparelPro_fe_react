import { PayloadAction } from "@reduxjs/toolkit";
import { PaginationAPIModel } from "../../models/references/ApiResult";
import { Currency } from "../../models/references/Currency";
import { CURRENCIES_ACTION_TYPES } from "./currency.types";

const INITIAL_STATE = {
  paginationAPIResult: null,
  error: null,
  isLoading: false,
  success: false,
};

const currencyReducer = (
  state = INITIAL_STATE,
  action: PayloadAction<PaginationAPIModel<Currency>>
) => {
  const { type, payload } = action;

  switch (type) {
    case CURRENCIES_ACTION_TYPES.LOAD_ALL_CURRENCIES_SUCCESS:
      console.log(payload.data);
      return {
        ...state,
        error: null,
        isLoading: false,
        success: true,
        paginationAPIResult: payload.data,
      };

    case CURRENCIES_ACTION_TYPES.LOAD_ALL_CURRENCIES_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: payload,
        success: false,
        paginationAPIResult: null,
      };
    case CURRENCIES_ACTION_TYPES.UPDATE_CURRENCY_START:
      return {
        ...state,
        isLoading: true,
        error: null,
        success: false,
        paginationAPIResult: null,
      };
    case CURRENCIES_ACTION_TYPES.UPDATE_CURRENCY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        success: true,
        paginationAPIResult: null,
      };
    case CURRENCIES_ACTION_TYPES.UPDATE_CURRENCY_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: payload,
        success: false,
        paginationAPIResult: null,
      };
    case CURRENCIES_ACTION_TYPES.CREATE_CURRENCY_START:
      return {
        ...state,
        isLoading: true,
        error: null,
        success: false,
        paginationAPIResult: null,
      };
    case CURRENCIES_ACTION_TYPES.CREATE_CURRENCY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        success: true,
        paginationAPIResult: null,
      };
    case CURRENCIES_ACTION_TYPES.CREATE_CURRENCY_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: payload,
        success: false,
        paginationAPIResult: null,
      };
    default:
      return state;
  }
};

export { currencyReducer };
