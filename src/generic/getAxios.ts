import axios from "axios";
import { APPARELPRO_ENDPOINTS } from "../defs/api-configurations";
import { PaginationAPIModel } from "../models/references/ApiResult";

type Params = {
  T: any;
  getUrl: string;
  parameters: [];
};
export const GetApi = ({ T, getUrl, parameters }: Params): Promise<any> => {
  return axios.get<PaginationAPIModel<typeof T>>(
    APPARELPRO_ENDPOINTS.URLS.BASEURL + getUrl,
    {
      params: parameters,
    }
  );
};
