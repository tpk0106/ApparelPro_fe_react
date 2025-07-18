import { createSelector } from "reselect";
import { PaginationAPIModel } from "../../models/references/ApiResult";

import { PaginationData } from "../../defs/defs";
import { MRT_PaginationState } from "material-react-table";
import { useSelector } from "react-redux";

import { CurrencyExchange } from "../../models/references/CurrencyExchange";
import { useGetCurrencyExchanges } from "../../data/custom.hooks.ts/apparel-pro.repository.hooks";

// export const getAllCurrencyExchanges = (state: {
//   currencyExchange: { paginationAPIResult: PaginationAPIModel<Supplier> };
// }): PaginationAPIModel<Supplier> => {
//   return state.currencyExchange.paginationAPIResult;
// };

const selectAllCurrencyExchanges = createSelector(
  [
    (state: {
      currencyExchange: {
        paginationAPIResult: {
          items: CurrencyExchange[];
        };
      };
    }) => state.currencyExchange.paginationAPIResult,
  ],
  (paginationAPIResult) => paginationAPIResult?.items
);

const selectTotalCurrencyExchanges = createSelector(
  [
    (state: {
      currencyExchange: {
        paginationAPIResult: PaginationAPIModel<CurrencyExchange>;
      };
    }) => state.currencyExchange.paginationAPIResult,
  ],
  (paginationAPIResult) => paginationAPIResult?.totalItems
);

export const SelectAllCurrencyExchanges = (
  paginate: PaginationData,
  pagination: MRT_PaginationState
) => {
  useGetCurrencyExchanges(paginate, pagination);
  const selector = useSelector(selectAllCurrencyExchanges);
  return selector;
};

export const SelectTotal = (
  paginate: PaginationData,
  pagination: MRT_PaginationState
) => {
  useGetCurrencyExchanges(paginate, pagination);
  const count = useSelector(selectTotalCurrencyExchanges);
  return count;
};
