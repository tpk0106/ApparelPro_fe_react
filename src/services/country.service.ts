import { client } from "../auth/axiosClient";
import { APPARELPRO_ENDPOINTS } from "../defs/api-configurations";
import { CreateCountryAPIModel, PaginationData } from "../defs/defs";
import { Country } from "../models/references/Country";

const loadCountries = async (data: PaginationData) => {
  return await client.get(
    APPARELPRO_ENDPOINTS.REFERENCE_SECTION.COUNTRY.GET_BY_PAGINATION,
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

const createNewCountry = async (
  createCountryAPIModel: CreateCountryAPIModel
) => {
  return await client.post(
    APPARELPRO_ENDPOINTS.REFERENCE_SECTION.COUNTRY.POST,
    createCountryAPIModel
  );
};

const updateEditCountry = async (code: string, updateCountry: Country) => {
  return await client.put(
    APPARELPRO_ENDPOINTS.REFERENCE_SECTION.COUNTRY.PUT,
    updateCountry,
    {
      params: {
        code: code,
      },
    }
  );
};

const removeCountry = async (code: string) => {
  return await client.delete(
    APPARELPRO_ENDPOINTS.REFERENCE_SECTION.COUNTRY.DELETE,
    {
      params: {
        code: code,
      },
    }
  );
};

export { loadCountries, createNewCountry, updateEditCountry, removeCountry };
