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
// import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
// import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
// import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import HourglassFullOutlinedIcon from "@mui/icons-material/HourglassFullOutlined";
import { Buyer } from "../../models/references/Buyer";
import { PaginationData } from "../../defs/defs";
import {
  useCreateBuyer,
  useDeleteBuyer,
  useUpdateBuyer,
} from "../../data/custom.hooks.ts/apparel-pro.repository.hooks";
import BuyerAddresses from "../address/buyer.address";

interface Props {
  columns: MRT_ColumnDef<Buyer>[];
  data: Buyer[];
  setBuyerComponentPaginationState: (
    pageIndex: number,
    pageSize: number
  ) => void;
  itemsCount: number;
  isError: boolean;
  isLoading: boolean;
  paginate: PaginationData;
  pagination: MRT_PaginationState;
}

const BuyerTable = ({
  columns,
  data,
  setBuyerComponentPaginationState,
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
  const validateBuyer = ({ name, status }: Buyer) => {
    return {
      name: validationRequired(name) ? "Buyer name required" : "",
      status: validationRequired(status) ? "Buyer Status required" : "",
    };
  };

  const handlePaginationChange = (updater: unknown) => {
    setPagination((oldPagination) => {
      const newPagination =
        typeof updater === "function" ? updater(oldPagination) : updater;
      console.log("buyer table : ", newPagination);
      setBuyerComponentPaginationState(
        newPagination.pageIndex,
        newPagination.pageSize
      );
      return newPagination;
    });
  };

  //CREATE action

  const handleCreateBuyer: MRT_TableOptions<Buyer>["onCreatingRowSave"] =
    async ({ values, table }) => {
      values = {
        ...values,
        id: 0,
        buyerCode: 0,
      };

      const newValidationErrors = validateBuyer(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      await createBuyer(values);
      table.setCreatingRow(null); //exit creating mode
    };

  //call CREATE hook
  const { mutateAsync: createBuyer, isPending: isCreatingBuyer } =
    useCreateBuyer(pagination, paginate);

  // UPDATE action
  const handleSaveBuyer: MRT_TableOptions<Buyer>["onEditingRowSave"] = async ({
    values,
    table,
    row,
  }) => {
    const originalRow = row.original;
    values = {
      ...values,
      buyerCode: originalRow.buyerCode,
      addressId: originalRow.addressId,
    };

    const newValidationErrors = validateBuyer({ ...values });
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});

    await updateBuyer(values);
    table.setEditingRow(null); //exit editing mode
  };

  //call UPDATE hook
  const { mutateAsync: updateBuyer, isPending: isUpdatingBuyer } =
    useUpdateBuyer(pagination);

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<Buyer>) => {
    if (window.confirm("Are you sure you want to delete this buyer?")) {
      deleteBuyer(row.original.buyerCode);
    }
  };

  // call DELETE hook
  const { mutateAsync: deleteBuyer, isPending: isDeletingBuyer } =
    useDeleteBuyer(pagination);

  const table = useMaterialReactTable({
    columns,
    data: data,

    initialState: { density: "compact" },
    // display mode
    createDisplayMode: "row",
    editDisplayMode: "row",

    enableExpandAll: false,

    // pagination
    manualPagination: true,
    paginationDisplayMode: "pages",
    onPaginationChange: handlePaginationChange,

    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [5, 10, 20],
      shape: "rounded",
      variant: "outlined",
    },
    rowCount: itemsCount,

    // state
    state: { pagination, showAlertBanner: isError },

    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateBuyer,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveBuyer,
    enableEditing: true,

    // toolbar styling
    muiTopToolbarProps: {
      sx: () => ({
        backgroundColor: "rgb(96 165 250)",
        boxShadow: "0px 0px 20px rgba(0,0,0,.5)",
      }),
    },

    // Cell styling

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

    // Body styling
    muiTableBodyProps: {
      sx: (theme) => ({
        fontSize: (theme.palette.background.paper = "2.9rem"),
        backgroundColor: "#000",
        border: "3px solid #f9f9",
      }),
    },

    muiTableBodyRowProps: ({ row, table }) => ({
      hover: !table.getState().editingRow,
      sx: {
        // backgroundColor:
        //   !table.getState().editingRow ||
        //   table.getState().editingRow?.id === row.id
        //     ? "red"
        //     : "yellow",
        opacity:
          !table.getState().editingRow ||
          table.getState().editingRow?.id === row.id
            ? 1
            : 0.5,
        backgroundColor:
          Number(row?.id) % 2 === 0
            ? darken("#4B9CD3", 0)
            : darken("#7CB9E8", 0),
        "&:hover td": {
          borderTop: "1px solid #fff",
          borderBottom: "1px solid #fff",
          //  color: "#42a5f5",
          color: "#fff",
          // backgroundColor: "#000",
          backgroundColor:
            table.getState().editingRow?.id === row.id ||
            table.getState().creatingRow
              ? "#fff"
              : "#000",
        },
      },
    }),

    // muiTableBodyRowProps: ({ isDetailPanel }) => ({
    //   sx: {
    //     isDetailPanel
    //       ? {{ backgroundColor: "yellow"}}
    //       : {{ backgroundColor: "red" }};
    //   }
    // }),

    // // Body styling
    // muiTableBodyProps: {
    //   sx: () => ({
    //     "& tr:nth-of-type(odd)": {
    //       backgroundColor: darken("#4B9CD3", 0),
    //     },
    //     "& tr:nth-of-type(even)": {
    //       backgroundColor: darken("#7CB9E8", 0),
    //     },
    //   }),
    // },

    // https://github.com/KevinVandy/material-react-table/issues/649

    muiTableFooterRowProps: {
      sx: () => ({
        backgroundColor: "rgb(96 165 250)",
        boxShadow: "0px 0px 20px rgba(0,0,0,.5)",
        boder: "5px solid red",
      }),
    },

    renderCaption: () => {
      return (isLoading && (
        <div className="text1-red-600 flex justify-center border1-2 border1-red-200 bg-red-50 w-[90%] m-auto h-auto align-middle rounded-md ">
          <div className="bg-gray-50 z-40 w-full h-full absolute top-5 left-10 opacity-90">
            <div className="w-[85%] h-[70%] border-2 border1-red-400 p-20  m-auto">
              <HourglassFullOutlinedIcon />
              {/* <PendingOutlinedIcon />
            <RefreshOutlinedIcon /> */}
            </div>
          </div>
        </div>
      )) ||
        (isUpdatingBuyer && (
          <div className="text-red-600 flex justify-center border-2 border-red-200 bg-red-50 w-[90%] m-auto h-auto align-middle rounded-md ">
            <div className="flex-col flex justify-center font-bold text-lg">
              <div>Updating Supplier.....</div>
            </div>
          </div>
        )) ||
        (isCreatingBuyer && (
          <div className="text-red-600 flex justify-center border-2 border-red-200 bg-red-50 w-[90%] m-auto h-auto align-middle rounded-md ">
            <div className="flex-col flex justify-center font-bold text-lg">
              <div>Creating new Supplier....</div>
            </div>
          </div>
        )) ||
        (isDeletingBuyer && (
          <div className="text-red-600 flex justify-center border-2 border-red-200 bg-red-50 w-[90%] m-auto h-auto align-middle rounded-md ">
            <div className="flex-col flex justify-center">
              <div>Deleting Supplier.....</div>
            </div>
          </div>
        )) ||
        (validationErrors &&
          (validationErrors.name || validationErrors.status)) ? (
        <div className="text-red-600 flex justify-center border-2 border-red-200 bg-red-50 w-[90%] m-auto h-auto align-middle rounded-md ">
          <div className="flex-col flex justify-center">
            <div>{validationErrors.name}</div>
            <div>{validationErrors.status}</div>
          </div>
        </div>
      ) : (
        ""
      );
    },

    muiToolbarAlertBannerProps:
      validationErrors !== undefined
        ? (console.log("error ....."),
          {
            color: "error",
            children: "Error loading data",
          })
        : undefined,

    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true);
        }}
      >
        New Buyer
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
            disabled={row.original.addresses.length > 0}
          >
            <DeleteForeverOutlinedIcon className="flex w-full justify-start h-5 w1-5 border1-4 border1-yellow-300" />
          </IconButton>
        </Tooltip>
      </Box>
    ),

    //custom expand button rotation

    muiExpandButtonProps: ({ row, table }) => ({
      onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }), //only 1 detail panel open at a time

      sx: {
        transform: row.getIsExpanded() ? "rotate(180deg)" : "rotate(-90deg)",
        transition: "transform 0.2s",
      },
    }),

    //conditionally render detail panel

    renderDetailPanel: ({ row }) => {
      const addresses = row.original.addresses;
      const addressId = row.original.addressId;

      return (
        <>
          <Box
            sx={{
              // "& tr:nth-of-type(odd)": {
              //   backgroundColor: darken("#4B9CD3", 0),
              // },
              // "& tr:nth-of-type(even)": {
              //   backgroundColor: darken("#7CB9E8", 0),
              // },

              margin: "0",
              fontSize: "50%",
              width: "100%",
            }}
          >
            <BuyerAddresses
              buyerAddresses={addresses}
              addressId={addressId}
              paginate={paginate}
              pagination={pagination}
              currentBuyerPageNumber={pagination.pageIndex}
              currentBuyerPageSize={pagination.pageSize}
            />
          </Box>
        </>
      );
    },
  });

  return <MaterialReactTable table={table} />;
};

export default BuyerTable;
