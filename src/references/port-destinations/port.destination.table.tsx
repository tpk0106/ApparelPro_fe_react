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

import { PaginationData } from "../../defs/defs";
import { PortDestination } from "../../models/references/PortDestination";
import {
  useCreatePortDestination,
  useDeletePortDestination,
  useUpdatePortDestination,
} from "../../data/custom.hooks.ts/apparel-pro.repository.hooks";

interface Props {
  columns: MRT_ColumnDef<PortDestination>[];
  data: PortDestination[];
  setPortDestionationComponentPaginationState: (
    pageIndex: number,
    pageSize: number
  ) => void;
  itemsCount: number;
  isError: boolean;
  isLoading: boolean;
  paginate: PaginationData;
  pagination: MRT_PaginationState;
}

const PortDestinationsTable = ({
  columns,
  data,
  setPortDestionationComponentPaginationState,
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
  const validatePortDestinations = ({
    destinationName,
    countryCode,
  }: PortDestination) => {
    return {
      countryCode: validationRequired(countryCode) ? "Country required" : "",
      destinationName: validationRequired(destinationName)
        ? "Port Destination name required"
        : "",
    };
  };

  //  CRUD Operations

  //CREATE action

  const handleCreatePortDestinations: MRT_TableOptions<PortDestination>["onCreatingRowSave"] =
    async ({ values, table }) => {
      values = {
        ...values,
        id: 0,
      };

      const newValidationErrors = validatePortDestinations(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      await createPortDestinations(values);
      table.setCreatingRow(null); //exit creating mode
    };

  //call CREATE hook
  const {
    mutateAsync: createPortDestinations,
    isPending: isCreatingportDestinations,
  } = useCreatePortDestination(pagination, paginate);

  // UPDATE action
  const handleSavePortDestinations: MRT_TableOptions<PortDestination>["onEditingRowSave"] =
    async ({ values, table, row }) => {
      const originalRow = row.original;
      values = {
        ...values,
        id: originalRow.id,
        countryCode: originalRow.countryCode,
      };

      const newValidationErrors = validatePortDestinations({ ...values });
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});

      await updatePortDestinations(values);
      table.setEditingRow(null); //exit editing mode
    };

  //call UPDATE hook
  const {
    mutateAsync: updatePortDestinations,
    isPending: isUpdatingPortDestinations,
  } = useUpdatePortDestination(pagination);

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<PortDestination>) => {
    if (
      window.confirm("Are you sure you want to delete this port destination?")
    ) {
      deletePortDestination({ ...row.original });
    }
  };

  // call DELETE hook
  const {
    mutateAsync: deletePortDestination,
    isPending: isDeletingPortDestinations,
  } = useDeletePortDestination(pagination);
  //

  // Pagination
  const handlePaginationChange = (updater: unknown) => {
    setPagination((oldPagination) => {
      const newPagination =
        typeof updater === "function" ? updater(oldPagination) : updater;
      console.log("supplier table : ", newPagination);
      setPortDestionationComponentPaginationState(
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
    onCreatingRowSave: handleCreatePortDestinations,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSavePortDestinations,

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
      //  console.log("isLoading", isLoading);
      return (
        (isLoading && (
          <div className="text-red-600 flex justify-center border-2 border-red-200 bg-red-50 w-[90%] m-auto h-auto align-middle rounded-md ">
            <div className="flex-col flex justify-center font-bold text-lg">
              <div>Loading.....</div>
            </div>
          </div>
        )) ||
        (isUpdatingPortDestinations && (
          <div className="text-red-600 flex justify-center border-2 border-red-200 bg-red-50 w-[90%] m-auto h-auto align-middle rounded-md ">
            <div className="flex-col flex justify-center font-bold text-lg">
              <div>Updating Port Destination.....</div>
            </div>
          </div>
        )) ||
        (isCreatingportDestinations && (
          <div className="text-red-600 flex justify-center border-2 border-red-200 bg-red-50 w-[90%] m-auto h-auto align-middle rounded-md ">
            <div className="flex-col flex justify-center font-bold text-lg">
              <div>Creating new Port Destination.....</div>
            </div>
          </div>
        )) ||
        (isDeletingPortDestinations && (
          <div className="text-red-600 flex justify-center border-2 border-red-200 bg-red-50 w-[90%] m-auto h-auto align-middle rounded-md ">
            <div className="flex-col flex justify-center">
              <div>Deleting Port Destination.....</div>
            </div>
          </div>
        )) ||
        (validationErrors &&
        (validationErrors.destinationName || validationErrors.countryCode) ? (
          <div className="text-red-600 flex justify-center border-2 border-red-200 bg-red-50 w-[90%] m-auto h-auto align-middle rounded-md ">
            <div className="flex-col flex justify-center">
              <div>{validationErrors.destinationName}</div>
              <div>{validationErrors.countryCode}</div>
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
        New Port Destination
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

export default PortDestinationsTable;
