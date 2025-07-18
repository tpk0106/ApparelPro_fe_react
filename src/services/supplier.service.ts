import { client } from "../auth/axiosClient";
import { APPARELPRO_ENDPOINTS } from "../defs/api-configurations";
import { PaginationData } from "../defs/defs";
import { Supplier } from "../models/references/Supplier";

const loadSuppliers = async (data: PaginationData) => {
  return await client.get(
    APPARELPRO_ENDPOINTS.REFERENCE_SECTION.SUPPLIER.GET_BY_PAGINATION,
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

const createNewSupplier = async (newSupplier: Supplier) => {
  return await client.post(
    APPARELPRO_ENDPOINTS.REFERENCE_SECTION.SUPPLIER.POST,
    newSupplier
  );
};

const updateEditSupplier = async (
  supplierCode: number,
  existingSupplier: Supplier
) => {
  return await client.put(
    APPARELPRO_ENDPOINTS.REFERENCE_SECTION.SUPPLIER.PUT,
    existingSupplier,
    {
      params: {
        supplierCode: supplierCode,
      },
    }
  );
};

const removeSupplier = async (supplierCode: number) => {
  return await client.delete(
    APPARELPRO_ENDPOINTS.REFERENCE_SECTION.SUPPLIER.DELETE + supplierCode // buyercode pass by route
  );
};

export { loadSuppliers, createNewSupplier, updateEditSupplier, removeSupplier };
