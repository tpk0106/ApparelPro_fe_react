import { useState } from "react";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_Row,
  MRT_TableOptions,
  useMaterialReactTable,
} from "material-react-table";

import { Box, Button, IconButton, Tooltip } from "@mui/material";

import { Buyer } from "../../models/references/Buyer";
import { PaginationData } from "../../defs/defs";
import {
  useCreateBuyer,
  useDeleteBuyer,
  useUpdateBuyer,
} from "../../data/custom.hooks.ts/apparel-pro.repository.hooks";

import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import { Address } from "../../models/references/Address";

interface Props {
  columns: MRT_ColumnDef<Address>[];
  data: Address[] | undefined;
  //   setBuyerComponentPaginationState: (
  //     pageIndex: number,
  //     pageSize: number
  //   ) => void;
  itemsCount: number;
  isError: boolean;
  //   paginate: PaginationData;
  //   pagination: MRT_PaginationState;
}

const AddressTable = ({
  columns,
  data,
  itemsCount,
}: //isError,
Props) => {
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  //   const [validationErrors, setValidationErrors] = useState<
  //     Record<string, string | undefined>
  //   >({});

  //   const validationRequired = (value: string) => !value?.length;
  //   const validateBuyer = ({ name, status }: Buyer) => {
  //     return {
  //       name: validationRequired(name) ? "Buyer name required" : "",
  //       status: validationRequired(status) ? "Buyer Status required" : "",
  //     };
  //   };

  //   const handlePaginationChange = (updater: unknown) => {
  //     setPagination((oldPagination) => {
  //       const newPagination =
  //         typeof updater === "function" ? updater(oldPagination) : updater;

  //       //   setBuyerComponentPaginationState(
  //       //     newPagination.pageIndex,
  //       //     newPagination.pageSize
  //       //   );
  //       return newPagination;
  //     });
  //   };

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<Address>) => {
    if (window.confirm("Are you sure you want to delete this buyer?")) {
      // deleteBuyer(row.original.buyerCode);
    }
  };
  //CREATE action

  //   const handleCreateBuyer: MRT_TableOptions<Address>["onCreatingRowSave"] =
  //     async ({ values, table }) => {
  //       //   values = {
  //       //     ...values,
  //       //     id: 0,
  //       //     buyerCode: 0,
  //       //   };
  //       //   const newValidationErrors = validateBuyer(values);
  //       //   if (Object.values(newValidationErrors).some((error) => error)) {
  //       //     setValidationErrors(newValidationErrors);
  //       //     console.log("error........", newValidationErrors);
  //       //     return;
  //       //   }
  //       //   setValidationErrors({});
  //       //   await createBuyer(values);
  //       //   table.setCreatingRow(null); //exit creating mode
  //     };

  //call CREATE hook
  //   const { mutateAsync: createBuyer, isPending: isCreatingBuyer } =
  //     useCreateBuyer(pagination);

  // UPDATE action
  //   const handleSaveBuyer: MRT_TableOptions<Buyer>["onEditingRowSave"] = async ({
  //     values,
  //     table,
  //     row,
  //   }) => {
  //     const originalRow = row.original;
  //     values = {
  //       ...values,
  //       buyerCode: originalRow.buyerCode,
  //       addressId: originalRow.addressId,
  //     };

  //     const newValidationErrors = validateBuyer({ ...values });
  //     if (Object.values(newValidationErrors).some((error) => error)) {
  //       setValidationErrors(newValidationErrors);
  //       return;
  //     }
  //     setValidationErrors({});

  //    // await updateBuyer(values);
  //     table.setEditingRow(null); //exit editing mode
  //   };

  //call UPDATE hook
  //   const {
  //     mutateAsync: updateBuyer,
  //     isPending: isUpdatingBuyer,
  //     failureCount,
  //     failureReason,
  //   } = useUpdateBuyer(pagination);

  //DELETE action
  //   const openDeleteConfirmModal = (row: MRT_Row<Address>) => {
  //     if (window.confirm("Are you sure you want to delete this Address?")) {
  //       deleteBuyer(row.original.buyerCode);
  //     }
  //   };

  //   // call DELETE hook
  //   const { mutateAsync: deleteBuyer, isPending: isDeletingCountry } =
  //     useDeleteBuyer(pagination);

  console.log("inside address table ==================> : ", data);

  const table = useMaterialReactTable({
    columns,
    data: data!,

    // display mode
    //  createDisplayMode: "row",
    //  editDisplayMode: "row",

    // pagination
    //  manualPagination: true,
    //   paginationDisplayMode: "pages",
    //   onPaginationChange: handlePaginationChange,
    //  muiPaginationProps: { rowsPerPageOptions: [5, 10, 20, 30] },
    rowCount: itemsCount,

    // state
    //   state: { pagination },

    // onCreatingRowCancel: () => setValidationErrors({}),
    // onCreatingRowSave: handleCreateBuyer,
    // onEditingRowCancel: () => setValidationErrors({}),
    // onEditingRowSave: handleSaveBuyer,
    // enableEditing: true,

    // renderCaption: () =>
    //   validationErrors && (validationErrors.name || validationErrors.status) ? (
    //     <div className="text-red-600 flex justify-center border-2 border-red-200 bg-red-50 w-[90%] m-auto h-auto align-middle rounded-md ">
    //       <div className="flex-col flex justify-center">
    //         <div>{validationErrors.name}</div>
    //         <div>{validationErrors.status}</div>
    //       </div>
    //     </div>
    //   ) : (
    //     ""
    //   ),

    // muiToolbarAlertBannerProps:
    //   validationErrors !== undefined
    //     ? (console.log("error ....."),
    //       {
    //         color: "error",
    //         children: "Error loading data",
    //       })
    //     : undefined,

    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true);
        }}
      >
        New Address
      </Button>
    ),

    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <ModeEditOutlinedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteForeverOutlinedIcon className="flex w-full justify-start h-5 w1-5 border1-4 border1-yellow-300" />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  });

  return <MaterialReactTable table={table} />;
};

export default AddressTable;
