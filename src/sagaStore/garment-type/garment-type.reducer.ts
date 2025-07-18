import { PayloadAction } from "@reduxjs/toolkit";
import { INITIAL_STATE } from "../../defs/defs";
import { GARMENT_TYPES_ACTION_TYPES } from "./garment-type.types";
import { PaginationAPIModel } from "../../models/references/ApiResult";
import { GarmentType } from "../../models/references/GarmentType";

const garmentTypeReducer = (
  state = INITIAL_STATE,
  action: PayloadAction<PaginationAPIModel<GarmentType>>
) => {
  const { payload, type } = action;

  switch (type) {
    case GARMENT_TYPES_ACTION_TYPES.LOAD_ALL_GARMENT_TYPES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        success: true,
        error: null,
        paginationAPIResult: payload.data,
      };
    case GARMENT_TYPES_ACTION_TYPES.LOAD_ALL_GARMENT_TYPES_FAILURE:
      return {
        ...state,
        isLoading: false,
        success: false,
        error: payload,
        paginationAPIResult: null,
      };
    case GARMENT_TYPES_ACTION_TYPES.CREATE_GARMENT_TYPE_START:
      return {
        ...state,
        isLoading: true,
        error: null,
        success: false,
        paginationAPIResult: null,
      };
    case GARMENT_TYPES_ACTION_TYPES.CREATE_GARMENT_TYPE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        success: true,
        paginationAPIResult: null,
      };
    case GARMENT_TYPES_ACTION_TYPES.CREATE_GARMENT_TYPE_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: payload,
        success: false,
        paginationAPIResult: null,
      };
    case GARMENT_TYPES_ACTION_TYPES.UPDATE_GARMENT_TYPE_START:
      return {
        ...state,
        isLoading: true,
        error: null,
        success: false,
        paginationAPIResult: null,
      };
    case GARMENT_TYPES_ACTION_TYPES.UPDATE_GARMENT_TYPE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        success: true,
        paginationAPIResult: null,
      };
    case GARMENT_TYPES_ACTION_TYPES.UPDATE_GARMENT_TYPE_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: payload,
        success: false,
        paginationAPIResult: null,
      };
    case GARMENT_TYPES_ACTION_TYPES.DELETE_GARMENT_TYPE_START:
      return {
        ...state,
        isLoading: true,
        error: null,
        success: false,
        paginationAPIResult: null,
      };
    case GARMENT_TYPES_ACTION_TYPES.DELETE_GARMENT_TYPE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        success: true,
        paginationAPIResult: null,
      };
    case GARMENT_TYPES_ACTION_TYPES.DELETE_GARMENT_TYPE_FAILURE:
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

export { garmentTypeReducer };
