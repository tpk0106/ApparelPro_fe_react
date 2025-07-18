import { createSelector } from "reselect";
import { PaginationAPIModel } from "../../models/references/ApiResult";

import { PaginationData } from "../../defs/defs";
import { MRT_PaginationState } from "material-react-table";
import { useSelector } from "react-redux";

import { GarmentType } from "../../models/references/GarmentType";
import { useGetGarmentTypes } from "../../data/custom.hooks.ts/apparel-pro.repository.hooks";

// export const getAllGarmentTypes = (state: {
//   garmentType: { paginationAPIResult: PaginationAPIModel<Supplier> };
// }): PaginationAPIModel<Supplier> => {
//   return state.garmentType.paginationAPIResult;
// };

const selectAllGarmentTypes = createSelector(
  [
    (state: {
      garmentType: {
        paginationAPIResult: {
          items: GarmentType[];
        };
      };
    }) => state.garmentType.paginationAPIResult,
  ],
  (paginationAPIResult) => paginationAPIResult?.items
);

const selectTotalGarmentTypes = createSelector(
  [
    (state: {
      garmentType: {
        paginationAPIResult: PaginationAPIModel<GarmentType>;
      };
    }) => state.garmentType.paginationAPIResult,
  ],
  (paginationAPIResult) => paginationAPIResult?.totalItems
);

export const SelectAllGarmentTypes = (
  paginate: PaginationData,
  pagination: MRT_PaginationState
) => {
  useGetGarmentTypes(paginate, pagination);
  const selector = useSelector(selectAllGarmentTypes);
  return selector;
};

export const SelectTotal = (
  paginate: PaginationData,
  pagination: MRT_PaginationState
) => {
  useGetGarmentTypes(paginate, pagination);
  const count = useSelector(selectTotalGarmentTypes);
  return count;
};
