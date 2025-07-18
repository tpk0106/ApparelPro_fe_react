import { Address } from "./Address";

export type Buyer = {
  buyerCode: number;
  status: string;
  name: string;
  telephoneNos: string;
  mobileNos: string;
  fax: string;
  addressId: string;
  cusdec: string;
  addresses: Address[];
};
