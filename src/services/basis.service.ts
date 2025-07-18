import { client } from "../auth/axiosClient";
import { APPARELPRO_ENDPOINTS } from "../defs/api-configurations";
import { PaginationData } from "../defs/defs";
import { Basis } from "../models/references/Basis";
import { Unit } from "../models/references/Unit";

const loadBasises = async (data: PaginationData) => {
  return await client.get(
    APPARELPRO_ENDPOINTS.REFERENCE_SECTION.BASIS.GET_BY_PAGINATION,
    {
      params: {
        pageNumber: data.pageNumber,
        pageSize: data.pageSize,
        sortColumn: data.sortColumn,
        sortOrder: data.sortOrder,
        filterColumn: data.filterColumn,
        filterQuery: data.filterQuery,
      },
    }
  );
};

const createNewBasis = async (newUnit: Basis) => {
  return await client.post(
    APPARELPRO_ENDPOINTS.REFERENCE_SECTION.BASIS.POST,
    newUnit
  );
};

const updateEditBasis = async (id: number, existingBasis: Basis) => {
  return await client.put(
    APPARELPRO_ENDPOINTS.REFERENCE_SECTION.BASIS.PUT,
    existingBasis,
    {
      params: {
        id: id,
      },
    }
  );
};

const removeBasis = async (id: number) => {
  return await client.delete(
    APPARELPRO_ENDPOINTS.REFERENCE_SECTION.UNIT.DELETE + id // buyercode pass by route
  );
};

export { loadBasises, createNewBasis, updateEditBasis, removeBasis };
