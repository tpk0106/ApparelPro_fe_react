import { createSelector } from "reselect";
import { PaginationAPIModel } from "../../models/references/ApiResult";
import { PaginationData } from "../../defs/defs";
import { MRT_PaginationState } from "material-react-table";
import { useSelector } from "react-redux";

import { Basis } from "../../models/references/Basis";
import { useGetBasises } from "../../data/custom.hooks.ts/apparel-pro.repository.hooks";

const selectAllBasises = createSelector(
  [
    (state: {
      basis: {
        paginationAPIResult: {
          items: Basis[];
        };
      };
    }) => state.basis.paginationAPIResult,
  ],
  (paginationAPIResult) => paginationAPIResult?.items
);

const selectTotalBasises = createSelector(
  [
    (state: {
      basis: {
        paginationAPIResult: PaginationAPIModel<Basis>;
      };
    }) => state.basis.paginationAPIResult,
  ],
  (paginationAPIResult) => paginationAPIResult?.totalItems
);

export const SelectAllBasises = (
  paginate: PaginationData,
  pagination: MRT_PaginationState
) => {
  useGetBasises(paginate, pagination);
  const selector = useSelector(selectAllBasises);

  return selector;
};

export const SelectBasissTotal = (
  paginate: PaginationData,
  pagination: MRT_PaginationState
) => {
  useGetBasises(paginate, pagination);
  const count = useSelector(selectTotalBasises);
  return count;
};
