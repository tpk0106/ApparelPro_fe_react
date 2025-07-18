import { PaginationAPIModel } from "../../models/references/ApiResult";
import { Country } from "../../models/references/Country";

export const selectAllCountries = (state: {
  country: { paginationAPIResult: PaginationAPIModel<Country> };
}): PaginationAPIModel<Country> => state.country.paginationAPIResult;

// export const isLoading = (state: { country: { isLoading: boolean } }) =>
//   state.country.isLoading;

export const selectAllCountryCodes = (state: {
  country: { paginationAPIResult: PaginationAPIModel<Country> };
}): string[] =>
  state.country.paginationAPIResult?.items.map((country) => country.code);

export const isLoading = (state: any) => state.isLoading;
