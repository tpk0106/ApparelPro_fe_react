import { client } from "../auth/axiosClient";
import { APPARELPRO_ENDPOINTS } from "../defs/api-configurations";
import { CreateAddressAPIModel } from "../defs/defs";
import { Address } from "../models/references/Address";

const loadAllAddressesForBuyer = async (addressId: string) => {
  return await client.get(
    APPARELPRO_ENDPOINTS.REFERENCE_SECTION.ADDRESS.GET_BY_ADDRESS_ID,
    {
      params: {
        addressId: addressId,
      },
    }
  );
};

const createNewBuyerAddress = async (
  createAddressAPIModel: CreateAddressAPIModel
) => {
  return await client.post(
    APPARELPRO_ENDPOINTS.REFERENCE_SECTION.ADDRESS.POST,
    createAddressAPIModel
  );
};

const removeBuyerAddress = async (buyerId: number, buyerAddressId: string) => {
  return await client.delete(
    APPARELPRO_ENDPOINTS.REFERENCE_SECTION.ADDRESS.DELETE +
      buyerId +
      "/" +
      buyerAddressId
  );
};

const updateAddress = async (
  addressId: string,
  existingBuyerAddress: Address
) => {
  return await client.put(
    APPARELPRO_ENDPOINTS.REFERENCE_SECTION.ADDRESS.PUT,
    existingBuyerAddress,
    {
      params: {
        id: existingBuyerAddress.id,
        addressId: addressId,
      },
    }
  );
};

export {
  loadAllAddressesForBuyer,
  updateAddress,
  createNewBuyerAddress,
  removeBuyerAddress,
};
