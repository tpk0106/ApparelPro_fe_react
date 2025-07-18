export const SLASH = "/";
export const ASSETS_FOLDER_LENGTH = 10;

export type menuItem = {
  subMenus: any[] | null;
  icon: string;
  label: string;
  routerLink: string;
  // menuClick: (e: MouseEvent) => {};
};

export type Item = {
  icon: string;
  label: string;
  routerLink: string;
};

export type PaginationData = {
  //pageIndex: number;
  pageNumber: number;
  pageSize: number;
  sortColumn: string | null;
  sortOrder: string | null;
  filterColumn: string | null;
  filterQuery: string | null;
};

export enum Gender {
  FEMALE = "Female",
  MALE = "Male",
}

export enum USER_CREDENTIALS {
  TOKEN_KEY = "token",
  REFRESH_TOKEN = "refreshToken",
  USER_KEY = "user",
}

export interface CreateCountryAPIModel {
  id: number;
  code: string;
  name: string;
  flag: BinaryType;
}

export interface CreateCurrencyAPIModel {
  id: number;
  code: string;
  countryCode: string;
  name: string;
  minor: string;
}

export interface CreateBuyerAPIModel {
  buyerCode: number;
  status: string;
  name: string;
  telephoneNos: string;
  mobileNos: string;
  fax: string;
  addressId: unknown;
  cusdec: string;
}

export interface CreatePortDestinationAPIModel {
  id: number;
  destinationName: string;
}

export interface UpdateBuyerAPIModel {
  buyerCode: number;
  status: string;
  name: string;
  telephoneNos: string;
  mobileNos: string;
  fax: string;
  addressId: unknown;
  cusdec: string;
}

export interface UpdatePortDestinationAPIModel {
  id: number;
  destinationName: string;
}

export interface CreateAddressAPIModel {
  addressId: string;
  id: number;
  addressType: AddressType;
  streetAddress: string;
  city: string;
  postCode: string;
  state: string;
  countryCode: string;
  country: string;
  default: boolean;
}

export interface CreateCurrencyConversionAPIModel {
  id: number;
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  date: Date;
}

export interface CreateCurrencyExchangeAPIModel {
  id: number;
  baseCurrency: string;
  quoteCurrency: string;
  rate: number;
  exchangeDate: Date;
}

export enum DROPDOWN_LIST_DATA {
  PAGE_SIZE = 1000,
  PAGE_NUMBER = 0,
}

export enum AddressType {
  Residential = 1,
  Postal = 2,
  Corporate = 3,
  Billing = 4,
  Delivery = 5,
}

export const INITIAL_STATE = {
  paginationAPIResult: null,
  error: null,
  isLoading: false,
  success: false,
};

export interface POParameters {
  buyerCode: number;
  order: string;
}
