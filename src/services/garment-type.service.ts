import { client } from "../auth/axiosClient";
import { APPARELPRO_ENDPOINTS } from "../defs/api-configurations";
import { PaginationData } from "../defs/defs";
import { GarmentType } from "../models/references/GarmentType";

const loadGarmentTypes = async (data: PaginationData) => {
  return await client.get(
    APPARELPRO_ENDPOINTS.REFERENCE_SECTION.GARMENT_TYPE.GET_BY_PAGINATION,
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

const createNewGarmentType = async (newGarmentType: GarmentType) => {
  return await client.post(
    APPARELPRO_ENDPOINTS.REFERENCE_SECTION.GARMENT_TYPE.POST,
    newGarmentType
  );
};

const updateEditGarmentType = async (
  id: number,
  existingGarmentType: GarmentType
) => {
  return await client.put(
    APPARELPRO_ENDPOINTS.REFERENCE_SECTION.GARMENT_TYPE.PUT,
    existingGarmentType,
    {
      params: {
        id: id,
      },
    }
  );
};

const removeGarmentType = async (id: number) => {
  return await client.delete(
    APPARELPRO_ENDPOINTS.REFERENCE_SECTION.GARMENT_TYPE.DELETE + id // buyercode pass by route
  );
};

export {
  loadGarmentTypes,
  createNewGarmentType,
  updateEditGarmentType,
  removeGarmentType,
};
