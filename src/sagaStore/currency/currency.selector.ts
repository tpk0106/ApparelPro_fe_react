import { createSelector } from "reselect";
import { PaginationAPIModel } from "../../models/references/ApiResult";
import { Currency } from "../../models/references/Currency";
import { PaginationData } from "../../defs/defs";
import { useSelector } from "react-redux";
import { MRT_PaginationState } from "material-react-table";
import {
  useCurrencies,
  useGetCurrencies,
} from "../../data/custom.hooks.ts/apparel-pro.repository.hooks";

// export const selectCurrencies = (state: {
//   currency: { paginationAPIResult: PaginationAPIModel<Currency> };
// }): PaginationAPIModel<Currency> => state.currency.paginationAPIResult;

// export const selectAllCurrencyCodes = (state: {
//   currency: { paginationAPIResult: PaginationAPIModel<Currency> };
// }): string[] =>
//   state.currency.paginationAPIResult?.items.map((curr) => curr.code);

const selectAllCurrencies = createSelector(
  [
    (state: {
      currency: {
        paginationAPIResult: {
          items: Currency[];
        };
      };
    }) => state.currency.paginationAPIResult,
  ],
  (paginationAPIResult) => paginationAPIResult?.items
);

const selectTotalCurrencies = createSelector(
  [
    (state: {
      currency: {
        paginationAPIResult: PaginationAPIModel<Currency>;
      };
    }) => state.currency.paginationAPIResult,
  ],
  (paginationAPIResult) => paginationAPIResult?.totalItems
);

export const selectAllCurrencyCodes = createSelector(
  [
    (state: { currency: { paginationAPIResult: { items: Currency[] } } }) =>
      state.currency.paginationAPIResult,
  ],
  (paginationAPIResult) => paginationAPIResult?.items.map((curr) => curr.code)
);

// export const selectAllCurrencyCodes = createSelector(
//   [
//     (state: {
//       currency: { paginationAPIResult: PaginationAPIModel<Currency> };
//     }) => state.currency.paginationAPIResult,
//   ],
//   (paginationAPIResult) => paginationAPIResult.items.map((curr) => curr.code)
// );

export const SelectAllCurrencies = (
  paginate: PaginationData
  // pagination: MRT_PaginationState
) => {
  //useGetCurrencies(paginate, pagination);
  useCurrencies(paginate);
  const selector = useSelector(selectAllCurrencies);

  return selector;
};

export const SelectCurrenciesTotal = (
  paginate: PaginationData
  //pagination: MRT_PaginationState
) => {
  //useGetCurrencies(paginate, pagination);
  useCurrencies(paginate);
  const count = useSelector(selectTotalCurrencies);
  return count;
};
