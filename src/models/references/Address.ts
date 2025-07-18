import { AddressType } from "../../defs/defs";

export type Address = {
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
};
