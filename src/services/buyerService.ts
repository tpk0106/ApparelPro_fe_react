import { client } from "../auth/axiosClient";
import { APPARELPRO_ENDPOINTS } from "../defs/api-configurations";
import { CreateBuyerAPIModel, PaginationData } from "../defs/defs";
import { Buyer } from "../models/references/Buyer";

const loadBuyers = async (data: PaginationData) => {
  return await client.get(
    APPARELPRO_ENDPOINTS.REFERENCE_SECTION.BUYER.GET_BY_PAGINATION,
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

const createNewBuyer = async (createBuyerAPIModel: CreateBuyerAPIModel) => {
  return await client.post(
    APPARELPRO_ENDPOINTS.REFERENCE_SECTION.BUYER.POST,
    createBuyerAPIModel
  );
};

const updateEditBuyer = async (buyerCode: number, existingBuyer: Buyer) => {
  return await client.put(
    APPARELPRO_ENDPOINTS.REFERENCE_SECTION.BUYER.PUT,
    existingBuyer,
    {
      params: {
        buyerCode: buyerCode,
      },
    }
  );
};

const removeBuyer = async (buyerCode: number) => {
  return await client.delete(
    APPARELPRO_ENDPOINTS.REFERENCE_SECTION.BUYER.DELETE + buyerCode // buyercode pass by route
  );
};

export { loadBuyers, createNewBuyer, updateEditBuyer, removeBuyer };
