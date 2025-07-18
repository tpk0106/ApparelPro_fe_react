import { COUNTRIES_ACTION_TYPES } from "./country.types";
const INITIAL_STATE = {
  paginationAPIResult: null,
  error: null,
  isLoading: false,
  success: false,
};

const countryReducer = (state = INITIAL_STATE, action = any) => {
  const { type, payload } = action;

  switch (type) {
    case COUNTRIES_ACTION_TYPES.LOAD_ALL_COUNTRIES_SUCCESS:
      console.log(payload.data);
      return {
        ...state,
        error: null,
        isLoading: false,
        success: true,
        paginationAPIResult: payload.data,
      };

    case COUNTRIES_ACTION_TYPES.LOAD_ALL_COUNTRIES_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: payload,
        success: false,
        paginationAPIResult: null,
      };
    case COUNTRIES_ACTION_TYPES.UPDATE_COUNTRY_START:
      return {
        ...state,
        isLoading: true,
        error: null,
        success: false,
        paginationAPIResult: null,
      };
    case COUNTRIES_ACTION_TYPES.UPDATE_COUNTRY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        success: true,
        paginationAPIResult: null,
      };
    case COUNTRIES_ACTION_TYPES.UPDATE_COUNTRY_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: payload,
        success: false,
        paginationAPIResult: null,
      };
    case COUNTRIES_ACTION_TYPES.CREATE_COUNTRY_START:
      return {
        ...state,
        isLoading: true,
        error: null,
        success: false,
        paginationAPIResult: null,
      };
    case COUNTRIES_ACTION_TYPES.CREATE_COUNTRY_SUCCESS:
      return {
        ...state,
        isLoading: false,
        error: null,
        success: true,
        paginationAPIResult: null,
      };
    case COUNTRIES_ACTION_TYPES.CREATE_COUNTRY_FAILURE:
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

export { countryReducer };
