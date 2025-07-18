import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_Row,
  MRT_TableOptions,
  useMaterialReactTable,
} from "material-react-table";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Button, darken, IconButton, Tooltip } from "@mui/material";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";

import { Address } from "../../models/references/Address";
import { PaginationData } from "../../defs/defs";
import { useGetBuyers } from "../buyers/custom.hooks";

import {
  useCountries,
  useCreateBuyerAddress,
  useDeleteBuyerAddress,
  useUpdateBuyerAddress,
} from "../../data/custom.hooks.ts/apparel-pro.repository.hooks";
import { selectAllCountryCodes } from "../../sagaStore/country/country.selector";

interface Prop {
  buyerAddresses: Address[];
  addressId: string;
  currentBuyerPageNumber: number;
  currentBuyerPageSize: number;
  paginate: PaginationData;
  pagination: MRT_PaginationState;
}

const BuyerAddresses = ({
  buyerAddresses,
  addressId,
  currentBuyerPageNumber,
  currentBuyerPageSize,
}: Prop) => {
  const paginate: PaginationData = {
    pageNumber: 0,
    pageSize: 10,
    sortColumn: null,
    sortOrder: null,
    filterColumn: null,
    filterQuery: null,
  };

  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [rowCount, setRowCount] = useState(0);

  const [validationErrors, setValidationErrors] =
    useState<Record<string, string | undefined>>();

  const validationRequired = (value: string) => !value?.length;

  useCountries(paginate);
  const countries = useSelector(selectAllCountryCodes);
  // const countries1 = useSelector(selectAllCountryCodes);
  // const countries = useMemo(() => countries1, [countries1]);

  const arr: Address[] = [];
  const totalAddresses = buyerAddresses.length;
  useEffect(() => {
    arr.length = 0;
    const start = pagination.pageIndex * pagination.pageSize;
    const diff = totalAddresses - start;

    const end =
      diff < pagination.pageSize
        ? diff + start
        : pagination.pageSize * (pagination.pageIndex + 1);

    const currentPageAddresses = buyerAddresses.slice(start, end);

    setAddresses(currentPageAddresses);
    console.log("addresses : ", addresses);

    console.log(addresses);

    setRowCount(buyerAddresses.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buyerAddresses, pagination]);

  const columns = useMemo<MRT_ColumnDef<Address>[]>(
    () => [
      {
        accessorKey: "streetAddress",
        header: "Street Address",
        size: 200,
        enableResizing: true,
        enableColumnActions: false,
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "city",
        header: "City",
        size: 100,
        enableResizing: true,
        enableColumnActions: false,
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "postCode",
        header: "Post Code",
        size: 15,
        enableColumnActions: false,
        enableSorting: false,
        enableColumnFilter: false,
        // enableColumnFilterModes: false,
        // enableSorting: false,
      },
      {
        accessorKey: "state",
        header: "State",
        size: 20,
        enableColumnActions: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "countryCode",
        header: "Country",
        size: 10,
        enableColumnActions: false,
        enableColumnFilter: false,
        editVariant: "select",
        editSelectOptions: countries,
        Cell: ({ renderedCellValue }) => (
          <Box
            sx={{
              display: "flex",
            }}
          >
            <span>{renderedCellValue}</span>
          </Box>
        ),
        muiEditTextFieldProps: ({ cell }) => ({
          select: true,
          required: true,
          error: !!validationErrors?.state,
          helperText: validationErrors?.state,
          //children,

          onBlur: (event) => {
            const validationError = validationRequired(
              event.currentTarget?.value
            )
              ? "required"
              : undefined;
            setValidationErrors({
              ...validationErrors,
              [cell.id]: validationError,
            });
          },
        }),
        columnFilterModeOptions: ["contains"],
      },
      {
        accessorKey: "default",
        header: "Default?",
        size: 50,
        enableColumnActions: false,
        enableSorting: false,
        enableColumnFilter: false,
        Cell: ({ renderedCellValue }) => (
          <Box
            sx={{
              display: "flex",
            }}
          >
            <span>{renderedCellValue === true ? "Yes" : "No"}</span>
          </Box>
        ),
        muiEditTextFieldProps: ({ cell }) => ({
          // select: true,
          required: true,
          error: !!validationErrors?.state,
          helperText: validationErrors?.state,
          //children,

          onBlur: (event) => {
            const validationError = validationRequired(
              event.currentTarget?.value
            )
              ? "required"
              : undefined;
            setValidationErrors({
              ...validationErrors,
              [cell.id]: validationError,
            });
          },
        }),
      },
    ],
    [countries, validationErrors]
  );

  // const validationRequired = (value: string) => !value?.length;
  const validateBuyerAddress = ({
    streetAddress,
    city,
    state,
    countryCode,
  }: Address) => {
    return {
      streetAddress: validationRequired(streetAddress)
        ? "Buyer Street Address required"
        : "",
      state: validationRequired(state) ? "Buyer Address State required" : "",
      countryCode: validationRequired(countryCode)
        ? "Buyer Address Country Code required"
        : "",
      city: validationRequired(city) ? "Buyer Address City required" : "",
    };
  };

  //CREATE action

  const handleCreateBuyerAddress: MRT_TableOptions<Address>["onCreatingRowSave"] =
    async ({ values, table }) => {
      values = {
        ...values,
        id: 0,
        addressId: addressId,
        addressType: 2,
        default: true,
      };
      const newValidationErrors = validateBuyerAddress(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        console.log("error........", newValidationErrors);
        return;
      }
      setValidationErrors({});
      //  console.log("passed values -------->", values);
      await createBuyerAddress(values);
      table.setCreatingRow(null); //exit creating mode
    };

  //call CREATE hook
  const { mutateAsync: createBuyerAddress, isPending: isCreatingBuyerAddress } =
    useCreateBuyerAddress(
      pagination,
      paginate,
      currentBuyerPageNumber,
      currentBuyerPageSize
    );

  // UPDATE action
  const handleSaveBuyerAddress: MRT_TableOptions<Address>["onEditingRowSave"] =
    async ({ values, table, row }) => {
      const originalRow = row.original;
      values = {
        ...values,
        id: originalRow.id,
        addressId: row.original.addressId,
        default: true,
      };

      const newValidationErrors = validateBuyerAddress({ ...values });
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});

      await updateBuyerAddress(values);
      table.setEditingRow(null); //exit editing mode
    };

  //call UPDATE hook
  const { mutateAsync: updateBuyerAddress, isPending: isUpdatingBuyer } =
    useUpdateBuyerAddress(pagination);

  //  call DELETE hook
  const { mutateAsync: deleteBuyerAddress, isPending: isDeletingCountry } =
    useDeleteBuyerAddress(
      pagination,
      paginate,
      currentBuyerPageNumber,
      currentBuyerPageSize
    );

  const openDeleteConfirmModal = (row: MRT_Row<Address>) => {
    if (window.confirm("Are you sure you want to delete this buyer Address?")) {
      const { id, addressId } = row.original;
      deleteBuyerAddress({ id, addressId });
    }
  };

  // Pagination
  const handlePaginationChange = (updater: unknown) => {
    setPagination((oldPagination) => {
      const newPagination =
        typeof updater === "function" ? updater(oldPagination) : updater;
      console.log("buyer table", pagination);
      setPagination(newPagination);
      return newPagination;
    });
  };

  // end of Pagination

  // ***************************
  // buyer Address table
  // ***************************

  const table = useMaterialReactTable({
    columns,
    data: addresses,
    rowCount: rowCount,

    defaultDisplayColumn: {
      // enableGlobalFilter: false,
    },

    // displayColumnDefOptions: {
    //   "mrt-row-actions": {
    //     size: 30,
    //     muiTableHeadCellProps: {
    //       align: "center",
    //       sx: {
    //         fontSize: "1.2rem",
    //         // backgroundColor: "red",
    //       },
    //     },
    //   },
    // },

    // defaultDisplayColumn: {
    //   enableColumnActions: false,
    //   enableEditing: true,
    //   enableColumnFilter: false,
    //   enableColumnFilterModes: false,
    //   enableColumnOrdering: false,
    //   enableSorting: false,
    //   enableGlobalFilter: false,
    // },

    //  display mode
    createDisplayMode: "row",
    editDisplayMode: "row",

    // pagination
    manualPagination: true,
    paginationDisplayMode: "pages",
    // onPaginationChange: setPagination,
    onPaginationChange: handlePaginationChange,
    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [5, 10, 20],
      shape: "rounded",
      variant: "outlined",
    },
    enableExpandAll: false,
    // layoutMode
    //layoutMode: "semantic",

    enableRowActions: false,

    // state
    state: { pagination },

    enableEditing: true,

    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateBuyerAddress,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveBuyerAddress,

    muiExpandButtonProps: ({ row, table }) => ({
      onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }), //set only this row to be expanded
    }),

    muiTableContainerProps: {
      sx: {
        boxShadow: "0 -5px 3px -3px black, 0 5px 3px -3px ",
      },
    },

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
        fontSize: (theme.palette.background.paper = "0.9rem"),
        backgroundColor: "#4B9CD3",
        //backgroundColor: "#f88",
        isDetailPanel: {
          // backgroundColor: darken("#4B9CD3", 0),
          backgroundColor: "#f88",
        },
      }),
    },

    muiTableHeadRowProps: {
      sx: (theme) => ({
        fontSize: (theme.palette.background.paper = "1.8rem"),
        boxShadow: "0 -5px 3px -3px yellow, 0 5px 3px -3px ",
        border: "3px solid #fff",
        borderRadius: "5px",
      }),
    },

    // muiTableBodyProps: {
    //   sx: (theme) => ({
    //     fontSize: (theme.palette.background.paper = "2.9rem"),
    //     // backgroundColor: "#000",
    //     // border: "3px solid #f9f9",
    //   }),
    // },
    // muiTableBodyRowProps: ({ isDetailPanel }) => {
    //   sx: {
    //     isDetailPanel
    //       ? {
    //           fontSize: "11px",
    //           color: "#000",
    //           borderTop: "1px solid #181b1e",
    //           backgroundColor: "#0f8f",
    //           "&:hover": {
    //             color: "#ff0000", // Change color on hover
    //             backgroundColor: "#0fdd", // Change background color on hover
    //           },
    //         }
    //       : { borderTop: "1px solid #181b1e", backgroundColor: "#888" };
    //   }
    // },

    // muiTableBodyRowProps: ({ row, table }) => ({
    //   hover: !table.getState().editingRow,
    //   sx: {
    //     // backgroundColor:
    //     //   !table.getState().editingRow ||
    //     //   table.getState().editingRow?.id === row.id
    //     //     ? "red"
    //     //     : "yellow",
    //     // opacity:
    //     //   !table.getState().editingRow ||
    //     //   table.getState().editingRow?.id === row.id
    //     //     ? 1
    //     //     : 0.5,
    //     backgroundColor:
    //       Number(row?.id) % 2 === 0 ||
    //       table.getState().editingRow?.id === row.id
    //         ? "#4B9CD3"
    //         : "#7CB9E8",
    //     // table.getState().editingRow?.id === row.id
    //     //   ? darken("#4B9CD3", 0)
    //     //   : darken("#7CB9E8", 0),
    //     "&:hover td": {
    //       borderTop: "1px solid #fff",
    //       borderBottom: "1px solid #fff",
    //       color: "#fff",
    //       backgroundColor:
    //         table.getState().editingRow?.id === row.id ? "#fff" : "#000",
    //     },
    //   },
    // }),

    // muiTableBodyRowProps: ({ row, table }) => ({
    //   hover: !table.getState().editingRow,
    //   sx: {
    //     opacity:
    //       !table.getState().editingRow ||
    //       table.getState().editingRow?.id === row.id ||
    //       table.getState().creatingRow
    //         ? 1
    //         : 0.4,
    //     backgroundColor:
    //       Number(row?.id) % 2 === 0 ||
    //       table.getState().editingRow?.id === row.id
    //         ? darken("#4B9CD3", 0)
    //         : darken("#7CB9E8", 0),
    //     "&:hover td": {
    //       borderTop: "1px solid #fff",
    //       borderBottom: "1px solid #fff",
    //       color: "#4B9CD3",
    //       backgroundColor:
    //         table.getState().editingRow?.id === row.id ||
    //         table.getState().creatingRow
    //           ? "#fff"
    //           : "#000",
    //     },
    //   },
    // }),

    muiTableBodyRowProps: ({ row, table }) => ({
      hover: !table.getState().editingRow,

      isDetailPanel: {
        backgroundColor: "#f88",
      },
      sx: {
        isDetailPanel: {
          backgroundColor:
            Number(row?.id) % 2 === 0
              ? darken("#4B9CD3", 0)
              : darken("#7CB9E8", 0),
        },

        backgroundColor:
          Number(row?.id) % 2 === 0
            ? darken("#4B9CD3", 0)
            : darken("#7CB9E8", 0),

        "&:hover td": {
          borderTop: "1px solid #fff",
          borderBottom: "1px solid #fff",
          //  color: "#42a5f5",
          // color: "#fff",
          // backgroundColor: "#000",
          isDetailPanel: {
            // backgroundColor: darken("#4B9CD3", 0),
            backgroundColor: "#f88",
          },
          backgroundColor:
            table.getState().editingRow?.id === row.id ||
            table.getState().creatingRow
              ? "#fff"
              : "#000",
        },
      },
    }),

    // // Body styling
    // muiTableBodyRowProps: ({ isDetailPanel }) => ({
    //   sx: {
    //     isDetailPanel
    //       ? { backgroundColor: "yellow"}
    //       : { backgroundColor: "red" };
    //   }
    // }),
    // muiTableBodyRowProps: ({ isDetailPanel }) => ({
    //   sx: () => {
    //     isDetailPanel
    //       ? {
    //           backgroundColor: "yellow",
    //         }
    //       : {
    //           backgroundColor: "red",
    //         };
    //   },
    // }),

    muiTableFooterRowProps: {
      sx: () => ({
        backgroundColor: "rgb(96 165 250)",
        boxShadow: "0px 0px 20px rgba(0,0,0,.5)",
        boder: "5px solid red",
      }),
    },

    renderCaption: () =>
      validationErrors && (validationErrors.name || validationErrors.status) ? (
        <div className="text-red-600 flex justify-center border-2 border-red-200 bg-red-50 w-[90%] m-auto h-auto align-middle rounded-md ">
          <div className="flex-col flex justify-center">
            <div>{validationErrors.streetAddress}</div>
            <div>{validationErrors.state}</div>
            <div>{validationErrors.city}</div>
            <div>{validationErrors.countryCode}</div>
          </div>
        </div>
      ) : (
        ""
      ),

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

    renderRowActions: ({ row }) => {
      return (
        <Box sx={{ display: "flex" }}>
          <Tooltip title="Edit buyer address">
            <IconButton onClick={() => table.setEditingRow(row)}>
              <ModeEditOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete buyer address">
            <IconButton
              color="error"
              onClick={() => openDeleteConfirmModal(row)}
            >
              <DeleteForeverOutlinedIcon className="flex w-full justify-start h-5 bg-1blue-600 border1-2 border1-gray-400" />
            </IconButton>
          </Tooltip>
        </Box>
      );
    },
  });

  return <MaterialReactTable table={table} />;
};

export default BuyerAddresses;

// https://github.com/KevinVandy/material-react-table/issues/1390
