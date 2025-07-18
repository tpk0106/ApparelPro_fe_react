import { client } from "../auth/axiosClient";
import { APPARELPRO_ENDPOINTS } from "../defs/api-configurations";
import { POParameters } from "../defs/defs";

const loadPurchaseOrder = async (po: POParameters) => {
  return await client.get(
    APPARELPRO_ENDPOINTS.ORDER_MANAGEMENT.PO.GET_PO_BY_BUYER_AND_ORDER,
    {
      params: {
        buyer: po.buyerCode,
        order: po.order,
      },
    }
  );
};

export { loadPurchaseOrder };
