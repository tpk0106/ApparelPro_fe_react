import { createSelector } from "reselect";
import { PaginationAPIModel } from "../../models/references/ApiResult";
import Bank from "../../models/references/Bank";
import { PaginationData } from "../../defs/defs";
import { MRT_PaginationState } from "material-react-table";
import { useSelector } from "react-redux";
import { useGetBanks } from "../../data/custom.hooks.ts/apparel-pro.repository.hooks";

//export const getBanks = (state: { bank: { banks: Bank[] } }): Bank[] =>
// export const getBanks = (state: {
//   bank: { banks: PaginationAPIModel<Bank> };
// }): Bank[] => state.bank.banks.items;

//export const getAllMyBanks = (state: any) => state.bank.paginationResult;
// export const getAllBanks = (state: {
//   bank: { paginationAPIResult: PaginationAPIModel<Bank> };
// }): PaginationAPIModel<Bank> => state.bank.paginationAPIResult;

const selectAllBanks = createSelector(
  [
    (state: {
      bank: {
        paginationAPIResult: {
          items: Bank[];
        };
      };
    }) => state.bank.paginationAPIResult,
  ],
  (paginationAPIResult) => paginationAPIResult?.items
);

const selectTotalBanks = createSelector(
  [
    (state: {
      bank: {
        paginationAPIResult: PaginationAPIModel<Bank>;
      };
    }) => state.bank.paginationAPIResult,
  ],
  (paginationAPIResult) => paginationAPIResult?.totalItems
);

export const SelectAllBanks = (
  paginate: PaginationData,
  pagination: MRT_PaginationState
) => {
  useGetBanks(paginate, pagination);
  const selector = useSelector(selectAllBanks);
  return selector;
};

export const SelectBanksTotal = (
  paginate: PaginationData,
  pagination: MRT_PaginationState
) => {
  useGetBanks(paginate, pagination);
  return useSelector(selectTotalBanks);
};
