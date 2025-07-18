import { client } from "../auth/axiosClient";
import { APPARELPRO_ENDPOINTS } from "../defs/api-configurations";
import { PaginationData } from "../defs/defs";
import Bank from "../models/references/Bank";

const loadBanks = async (data: PaginationData) => {
  return await client.get(
    APPARELPRO_ENDPOINTS.REFERENCE_SECTION.BANK.GET_BY_PAGINATION,
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

const loadBankByBankCode = async (bankCode: string) => {
  return await client.get(
    APPARELPRO_ENDPOINTS.REFERENCE_SECTION.BANK.GET_BY_BANK_CODE,
    {
      params: {
        bankCode: bankCode,
      },
    }
  );
};

const doesBankExist = async (bankCode: string) => {
  return await client.get(
    APPARELPRO_ENDPOINTS.REFERENCE_SECTION.BANK.DOES_BANK_EXIST,
    {
      params: {
        bankCode: bankCode,
      },
    }
  );
};

const createNewBank = async (newBank: Bank) => {
  return await client.post(
    APPARELPRO_ENDPOINTS.REFERENCE_SECTION.BANK.POST,
    newBank
  );
};

const deleteBank = async (bankId: string) => {
  return await client.delete({
    params: { bankId: bankId },
  });
};

const updateEditBank = async (bankCode: string, existingBank: Bank) => {
  return await client.put(
    APPARELPRO_ENDPOINTS.REFERENCE_SECTION.BANK.PUT,
    existingBank,
    {
      params: {
        bankCode: bankCode,
      },
    }
  );
};

export {
  loadBanks,
  createNewBank,
  deleteBank,
  updateEditBank,
  loadBankByBankCode,
  doesBankExist,
};
