import { MRT_PaginationState } from "material-react-table";
import { PaginationData } from "../../defs/defs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { Buyer } from "../../models/references/Buyer";

import {
  loadAllBuyersStart,
  updateBuyerStart,
} from "../../sagaStore/buyer/buyer.action";

const useGetBuyers = (
  paginate: PaginationData,
  pagination: MRT_PaginationState
) => {
  const dispatch = useDispatch();

  return useQuery<Buyer[]>({
    queryKey: ["buyers", pagination?.pageSize, pagination?.pageIndex],
    queryFn: async () => {
      dispatch(
        loadAllBuyersStart({
          ...paginate,
          pageNumber: pagination?.pageIndex,
          ...pagination,
        })
      );
      return [];
    },
    refetchOnWindowFocus: false,
  });
};

// const useUpdateBuyer = () => {
//   const queryClient = useQueryClient();
//   const dispatch = useDispatch();
//   return useMutation({
//     mutationFn: async (bank: Buyer) => {
//       //send api update request here
//       const res = dispatch(updateBuyerStart({ ...bank }));
//       return res.payload;
//     },

//     // client side optimistic update
//     onMutate: (editBuyer: Buyer) => {
//       console.log("onMutate EDIT BANK start", editBuyer);

//       queryClient.setQueryData(["banks"], (prevBuyers: Buyer[]) =>
//         prevBuyers?.map((prevBuyer: Buyer) =>
//           prevBuyer.buyerCode === editBuyer.buyerCode ? editBuyer : prevBuyer
//         )
//       );
//       console.log("onMutate BANK end");
//     },

//     onSettled: () => {
//       console.log("onSetteled.....BANK");
//       //    queryClient.invalidateQueries({ queryKey: ["banks"] }); //refetch users after mutation, disabled for demo.
//     },
//   });
// };

export { useGetBuyers };
