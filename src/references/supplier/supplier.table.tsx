import { useState } from "react";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_Row,
  MRT_TableOptions,
  useMaterialReactTable,
} from "material-react-table";

import { Box, Button, darken, IconButton, Tooltip } from "@mui/material";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";

import {
  useCreateSupplier,
  useDeleteSupplier,
  useUpdateSupplier,
} from "../../data/custom.hooks.ts/apparel-pro.repository.hooks";

import { Supplier } from "../../models/references/Supplier";
import { PaginationData } from "../../defs/defs";
import SupplierAddresses from "../address/supplier.address";

interface Props {
  columns: MRT_ColumnDef<Supplier>[];
  data: Supplier[];
  setSupplierComponentPaginationState: (
    pageIndex: number,
    pageSize: number
  ) => void;
  itemsCount: number;
  isError: boolean;
  isLoading: boolean;
  paginate: PaginationData;
  pagination: MRT_PaginationState;
}

const SupplierTable = ({
  columns,
  data,
  setSupplierComponentPaginationState,
  itemsCount,
  isError,
  isLoading,
}: Props) => {
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const paginate: PaginationData = {
    pageNumber: 0,
    pageSize: 10,
    sortColumn: null,
    sortOrder: null,
    filterColumn: null,
    filterQuery: null,
  };

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const validationRequired = (value: string) => !value?.length;
  const validateSupplier = ({ name }: Supplier) => {
    return {
      name: validationRequired(name) ? "Supplier name required" : "",
    };
  };

  //  CRUD Operations

  //CREATE action

  const handleCreateSupplier: MRT_TableOptions<Supplier>["onCreatingRowSave"] =
    async ({ values, table }) => {
      values = {
        ...values,
        supplierCode: 0,
      };

      const newValidationErrors = validateSupplier(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      await createSupplier(values);
      table.setCreatingRow(null); //exit creating mode
    };

  //call CREATE hook
  const { mutateAsync: createSupplier, isPending: isCreatingSupplier } =
    useCreateSupplier(pagination, paginate);

  // UPDATE action
  const handleSaveSupplier: MRT_TableOptions<Supplier>["onEditingRowSave"] =
    async ({ values, table, row }) => {
      const originalRow = row.original;
      values = {
        ...values,
        supplierCode: originalRow.supplierCode,
        addressId: originalRow.addressId,
      };

      const newValidationErrors = validateSupplier({ ...values });
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});

      await updateSupplier(values);
      table.setEditingRow(null); //exit editing mode
    };

  //call UPDATE hook
  const { mutateAsync: updateSupplier, isPending: isUpdatingSupplier } =
    useUpdateSupplier(pagination);

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<Supplier>) => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      deleteSupplier(row.original.supplierCode);
    }
  };

  // call DELETE hook
  const { mutateAsync: deleteSupplier, isPending: isDeletingSupplier } =
    useDeleteSupplier(pagination);
  //

  // Pagination
  const handlePaginationChange = (updater: unknown) => {
    setPagination((oldPagination) => {
      const newPagination =
        typeof updater === "function" ? updater(oldPagination) : updater;

      setSupplierComponentPaginationState(
        newPagination.pageIndex,
        newPagination.pageSize
      );
      return newPagination;
    });
  };
  // end of Pagination

  const table = useMaterialReactTable({
    columns,
    data: data,
    initialState: { density: "compact" },

    // display mode
    createDisplayMode: "row",
    editDisplayMode: "row",

    enableExpandAll: false,

    // pagination
    rowCount: itemsCount,
    manualPagination: true,
    paginationDisplayMode: "pages",
    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [5, 10, 20],
      shape: "rounded",
      variant: "outlined",
    },
    onPaginationChange: handlePaginationChange,

    enableEditing: true,

    // state
    state: { pagination, showAlertBanner: isError },

    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateSupplier,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveSupplier,

    muiExpandButtonProps: ({ row, table }) => ({
      onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }),
    }),

    muiTopToolbarProps: {
      sx: () => ({
        backgroundColor: "rgb(96 165 250)",
        boxShadow: "0px 0px 20px rgba(0,0,0,.5)",
      }),
    },

    // Cell styling
    muiTableHeadCellProps: {
      sx: (theme) => ({
        fontSize: (theme.palette.background.paper = "0.8rem"),
        fontWeight: "600",
        backgroundColor: "#fff",
        // color: "#42a5f5",
        color: "#000",
        boxShadow: "0 -5px 3px -3px black, 0 5px 3px -3px ",
      }),
    },

    // table body
    muiTableBodyProps: {
      sx: (theme) => ({
        fontSize: (theme.palette.background.paper = "0.5rem"),
      }),
    },

    muiTableBodyRowProps: ({ row, table }) => ({
      hover: !table.getState().editingRow,
      sx: {
        opacity:
          !table.getState().editingRow ||
          table.getState().editingRow?.id === row.id ||
          table.getState().creatingRow
            ? 1
            : 0.4,
        backgroundColor:
          Number(row?.id) % 2 === 0 ||
          table.getState().editingRow?.id === row.id
            ? darken("#4B9CD3", 0)
            : darken("#7CB9E8", 0),
        "&:hover td": {
          borderTop: "1px solid #fff",
          borderBottom: "1px solid #fff",
          color: "#4B9CD3",
          backgroundColor:
            table.getState().editingRow?.id === row.id ||
            table.getState().creatingRow
              ? "#fff"
              : "#000",
        },
      },
    }),

    muiTableFooterRowProps: {
      sx: () => ({
        backgroundColor: "rgb(96 165 250)",
        boxShadow: "0px 0px 20px rgba(0,0,0,.5)",
        boder: "5px solid red",
      }),
    },

    renderCaption: () => {
      return (
        (isLoading && (
          <div className="text-red-600 flex justify-center border-2 border-red-200 bg-red-50 w-[90%] m-auto h-auto align-middle rounded-md ">
            <div className="flex-col flex justify-center font-bold text-lg">
              <div>Loading.....</div>
            </div>
          </div>
        )) ||
        (isUpdatingSupplier && (
          <div className="text-red-600 flex justify-center border-2 border-red-200 bg-red-50 w-[90%] m-auto h-auto align-middle rounded-md ">
            <div className="flex-col flex justify-center font-bold text-lg">
              <div>Updating Supplier.....</div>
            </div>
          </div>
        )) ||
        (isCreatingSupplier && (
          <div className="text-red-600 flex justify-center border-2 border-red-200 bg-red-50 w-[90%] m-auto h-auto align-middle rounded-md ">
            <div className="flex-col flex justify-center font-bold text-lg">
              <div>Creating new Supplier....</div>
            </div>
          </div>
        )) ||
        (isDeletingSupplier && (
          <div className="text-red-600 flex justify-center border-2 border-red-200 bg-red-50 w-[90%] m-auto h-auto align-middle rounded-md ">
            <div className="flex-col flex justify-center">
              <div>Deleting Supplier.....</div>
            </div>
          </div>
        )) ||
        (validationErrors && validationErrors.name ? (
          <div className="text-red-600 flex justify-center border-2 border-red-200 bg-red-50 w-[90%] m-auto h-auto align-middle rounded-md ">
            <div className="flex-col flex justify-center">
              <div>{validationErrors.name}</div>
            </div>
          </div>
        ) : (
          ""
        ))
      );
    },

    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true);
        }}
      >
        New Supplier
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
          <IconButton
            color="error"
            onClick={() => openDeleteConfirmModal(row)}
            disabled={row.original.addresses?.length > 0}
          >
            <DeleteForeverOutlinedIcon className="flex w-full justify-start h-5 w1-5 border1-4 border1-yellow-300" />
          </IconButton>
        </Tooltip>
      </Box>
    ),

    renderDetailPanel: ({ row }) => {
      const supplierAddresses = row.original.addresses;
      const addressId = row.original.addressId;

      return (
        <div>
          <Box
            sx={{
              "& tr:nth-of-type(odd)": {
                backgroundColor: darken("#4B9CD3", 0),
              },
              "& tr:nth-of-type(even)": {
                backgroundColor: darken("#7CB9E8", 0),
              },
              margin: "auto",
              fontSize: "70%",
              width: "100%",
            }}
          >
            <SupplierAddresses
              supplierAddresses={supplierAddresses}
              addressId={addressId}
              currentSupplierPageNumber={pagination.pageIndex}
              currentSupplierPageSize={pagination.pageSize}
              paginate={paginate}
              pagination={pagination}
            />
          </Box>
        </div>
      );
    },
  });

  return <MaterialReactTable table={table} />;
};

export default SupplierTable;
