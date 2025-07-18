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

import Bank from "../../models/references/Bank";
import { PaginationData } from "../../defs/defs";
import {
  useCreateBank,
  useDeleteBank,
  useUpdateBank,
} from "../../data/custom.hooks.ts/apparel-pro.repository.hooks";

import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";

interface Props {
  columns: MRT_ColumnDef<Bank>[];
  data: Bank[];
  setBankComponentPaginationState: (
    pageIndex: number,
    pageSize: number
  ) => void;
  itemsCount: number;
  isError: boolean;
  isLoading: boolean;
  paginate: PaginationData;
  pagination: MRT_PaginationState;
}

const BankTable = ({
  columns,
  data,
  setBankComponentPaginationState,
  itemsCount,
  isError,
  isLoading,
}: Props) => {
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const validationRequired = (value: string) => !value?.length;
  const validateBank = ({ name, swiftCode, currencyCode }: Bank) => {
    return {
      name: validationRequired(name) ? "bank name required" : "",
      swiftCode: validationRequired(swiftCode) ? "swift code required" : "",
      currencyCode: validationRequired(currencyCode)
        ? "Currency required, please select from the list"
        : "",
    };
  };

  const handlePaginationChange = (updater: unknown) => {
    setPagination((oldPagination) => {
      const newPagination =
        typeof updater === "function" ? updater(oldPagination) : updater;

      setBankComponentPaginationState(
        newPagination.pageIndex,
        newPagination.pageSize
      );
      return newPagination;
    });
  };

  //CREATE action

  const handleCreateBank: MRT_TableOptions<Bank>["onCreatingRowSave"] = async ({
    values,
    table,
  }) => {
    values = {
      ...values,
      id: 0,
      addressId: 64,
    };

    const newValidationErrors = validateBank(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await createBank(values);
    table.setCreatingRow(null); //exit creating mode
  };

  //call CREATE hook
  const { mutateAsync: createBank, isPending: isCreatingBank } =
    useCreateBank();

  // UPDATE action
  const handleSaveBank: MRT_TableOptions<Bank>["onEditingRowSave"] = async ({
    values,
    table,
  }) => {
    const newValidationErrors = validateBank({ ...values });
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    await updateBank(values);
    table.setEditingRow(null);
  };

  //call UPDATE hook
  const { mutateAsync: updateBank, isPending: isUpdatingBank } =
    useUpdateBank(pagination);

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<Bank>) => {
    if (
      window.confirm(
        `Are you sure you want to delete this bank, ${row.original.bankCode}, ${row.original.name}?`
      )
    ) {
      deleteBank(row.original.bankCode);
    }
  };

  // call DELETE hook
  const { mutateAsync: deleteBank, isPending: isDeletingBank } =
    useDeleteBank(pagination);

  const table = useMaterialReactTable({
    columns,
    data: data,

    // display mode
    createDisplayMode: "row",
    editDisplayMode: "row",

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
    initialState: { density: "compact" },
    getRowId: (row) => row.bankCode,

    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateBank,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveBank,
    enableEditing: true,

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
        (isUpdatingBank && (
          <div className="text-red-600 flex justify-center border-2 border-red-200 bg-red-50 w-[90%] m-auto h-auto align-middle rounded-md ">
            <div className="flex-col flex justify-center font-bold text-lg">
              <div>Updating Bank.....</div>
            </div>
          </div>
        )) ||
        (isCreatingBank && (
          <div className="text-red-600 flex justify-center border-2 border-red-200 bg-red-50 w-[90%] m-auto h-auto align-middle rounded-md ">
            <div className="flex-col flex justify-center font-bold text-lg">
              <div>Creating Bank.....</div>
            </div>
          </div>
        )) ||
        (isDeletingBank && (
          <div className="text-red-600 flex justify-center border-2 border-red-200 bg-red-50 w-[90%] m-auto h-auto align-middle rounded-md ">
            <div className="flex-col flex justify-center">
              <div>Deleting Bank.....</div>
            </div>
          </div>
        )) ||
        (validationErrors &&
        (validationErrors.name ||
          validationErrors.swiftCode ||
          validationErrors.currencyCode) ? (
          <div className="text-red-600 flex justify-center border-2 border-red-200 bg-red-50 w-[90%] m-auto h-auto align-middle rounded-md ">
            <div className="flex-col flex justify-center">
              <div>{validationErrors.name}</div>
              <div>{validationErrors.swiftCode}</div>
              <div>{validationErrors.currencyCode}</div>
            </div>
          </div>
        ) : (
          ""
        ))
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
        New Bank
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

export default BankTable;

// https://github.com/KevinVandy/material-react-table/issues/1251
