import { useEffect, useMemo, useState } from "react";
import { Address } from "../../models/references/Address";
import { Box, Button, darken, IconButton, Tooltip } from "@mui/material";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_PaginationState,
  MRT_Row,
  MRT_TableOptions,
  useMaterialReactTable,
} from "material-react-table";

import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import { PaginationData } from "../../defs/defs";
import {
  useCreateSupplierAddress,
  useDeleteSupplierAddress,
  useUpdateSupplierAddress,
} from "../../data/custom.hooks.ts/apparel-pro.repository.hooks";

import { SelectCountries } from "../../sagaStore/address/address.selector";

interface Props {
  supplierAddresses: Address[];
  addressId: string;
  currentSupplierPageNumber: number;
  currentSupplierPageSize: number;
  paginate: PaginationData;
  pagination: MRT_PaginationState;
}

const SupplierAddresses = ({
  supplierAddresses,
  addressId,
  currentSupplierPageNumber,
  currentSupplierPageSize,
}: Props) => {
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

  const countries = SelectCountries(paginate);

  const arr: Address[] = [];
  const totalAddresses = supplierAddresses.length;
  useEffect(() => {
    arr.length = 0;
    const start = pagination.pageIndex * pagination.pageSize;
    const diff = totalAddresses - start;

    const end =
      diff < pagination.pageSize
        ? diff + start
        : pagination.pageSize * (pagination.pageIndex + 1);

    const currentPageAddresses = supplierAddresses.slice(start, end);

    setAddresses(currentPageAddresses);

    setRowCount(supplierAddresses.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplierAddresses, pagination]);

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
    [validationErrors, countries]
  );

  // const validationRequired = (value: string) => !value?.length;
  const validateSupplierAddress = ({
    streetAddress,
    city,
    state,
    countryCode,
  }: Address) => {
    return {
      streetAddress: validationRequired(streetAddress)
        ? "Supplier Street Address required"
        : "",
      state: validationRequired(state) ? "Buyer Address State required" : "",
      countryCode: validationRequired(countryCode)
        ? "Supplier Address Country Code required"
        : "",
      city: validationRequired(city) ? "Supplier Address City required" : "",
    };
  };

  // CRUD
  //CREATE action

  const handleCreateSupplierAddress: MRT_TableOptions<Address>["onCreatingRowSave"] =
    async ({ values, table }) => {
      values = {
        ...values,
        id: 0,
        addressId: addressId,
        addressType: 2,
        default: true,
      };
      const newValidationErrors = validateSupplierAddress(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});

      await createSupplierAddress(values);
      table.setCreatingRow(null); //exit creating mode
    };

  //call CREATE hook
  const {
    mutateAsync: createSupplierAddress,
    isPending: isCreatingSupplierAddress,
  } = useCreateSupplierAddress(
    pagination,
    paginate,
    currentSupplierPageNumber,
    currentSupplierPageSize
  );

  // UPDATE action
  const handleSaveSupplierAddress: MRT_TableOptions<Address>["onEditingRowSave"] =
    async ({ values, table, row }) => {
      const originalRow = row.original;
      values = {
        ...values,
        id: originalRow.id,
        addressId: row.original.addressId,
        default: true,
      };

      const newValidationErrors = validateSupplierAddress({ ...values });
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});

      // console.log("values ----->", values);
      await updateSupplierAddress(values);
      table.setEditingRow(null); //exit editing mode
    };

  //call UPDATE hook
  const { mutateAsync: updateSupplierAddress, isPending: isUpdatingBuyer } =
    useUpdateSupplierAddress(pagination);

  //  call DELETE hook
  const { mutateAsync: deleteSupplierAddress, isPending: isDeletingCountry } =
    useDeleteSupplierAddress(
      pagination,
      paginate,
      currentSupplierPageNumber,
      currentSupplierPageSize
    );

  const openDeleteConfirmModal = (row: MRT_Row<Address>) => {
    if (
      window.confirm("Are you sure you want to delete this supplier Address?")
    ) {
      const { id, addressId } = row.original;
      deleteSupplierAddress({ id, addressId });
    }
  };

  // end of CRUD

  // Pagination

  const handlePaginationChange = (updater: unknown) => {
    setPagination((oldPagination) => {
      const newPagination =
        typeof updater === "function" ? updater(oldPagination) : updater;
      setPagination(newPagination);
      return newPagination;
    });
  };

  // end of Pagination

  // table
  const table = useMaterialReactTable({
    columns,
    data: addresses, //  display mode

    rowCount: rowCount,

    initialState: { density: "compact" },

    // display mode
    createDisplayMode: "row",
    editDisplayMode: "row",

    enableExpandAll: false,

    // pagination
    manualPagination: true,
    paginationDisplayMode: "pages",
    //muiPaginationProps: { rowsPerPageOptions: [5, 10, 20, 30] },
    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [5, 10, 20],
      shape: "rounded",
      variant: "outlined",
    },
    onPaginationChange: handlePaginationChange,

    // state
    state: { pagination },

    enableEditing: true,

    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateSupplierAddress,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveSupplierAddress,
    muiExpandButtonProps: ({ row, table }) => ({
      onClick: () => table.setExpanded({ [row.id]: !row.getIsExpanded() }),
    }),

    // isCreatingSupplierAddress: () => {
    //   return <div>Creating please wait</div>;
    // },

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
          <Tooltip title="Edit supplier address">
            <IconButton onClick={() => table.setEditingRow(row)}>
              <ModeEditOutlinedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete supplier address">
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

  return (
    <div>
      <MaterialReactTable table={table} />
    </div>
  );
};

export default SupplierAddresses;
