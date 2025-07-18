import { Box, darken } from "@mui/material";
import {
  MaterialReactTable,
  MRT_ColumnDef,
  MRT_PaginationState,
  useMaterialReactTable,
} from "material-react-table";

import { Address } from "../../models/references/Address";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useCountries } from "../../data/custom.hooks.ts/apparel-pro.repository.hooks";
import { selectAllCountryCodes } from "../../sagaStore/country/country.selector";
import { PaginationData } from "../../defs/defs";

interface Props {
  supplierAddresses: Address[];
}

const SuppAddresses = ({ supplierAddresses }: Props) => {
  const paginate: PaginationData = {
    pageNumber: 0,
    pageSize: 10,
    sortColumn: null,
    sortOrder: null,
    filterColumn: null,
    filterQuery: null,
  };

  const [rowCount, setRowCount] = useState(0);
  //useCountries(paginate);
  //const countries = useSelector(selectAllCountryCodes);

  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  setRowCount(supplierAddresses.length);

  const [validationErrors, setValidationErrors] =
    useState<Record<string, string | undefined>>();

  const validationRequired = (value: string) => !value?.length;

  const supplier_Addresses = useMemo(() => {
    const addresses: Address[] = [];
    return addresses;
  }, []);

  useEffect(() => {
    console.log("useEFFECT:", supplierAddresses);
    if (supplierAddresses) {
      supplierAddresses.forEach((a) => {
        const address: Address = {
          id: a.id,
          addressId: a.addressId,
          addressType: a.addressType,
          city: a.city,
          streetAddress: a.streetAddress,
          state: a.state,
          postCode: a.postCode,
          countryCode: a.countryCode,
          country: a.country,
          default: a.default,
        };
        supplier_Addresses.push(address);
      });
    }
    setRowCount(supplier_Addresses.length);
  }, [supplierAddresses, supplier_Addresses]);

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
        // editSelectOptions: countries,
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
    [validationErrors]
  );

  // table
  const table = useMaterialReactTable({
    columns,
    data: supplierAddresses, //  display mode
    createDisplayMode: "row",
    editDisplayMode: "row",
    rowCount: rowCount,
  });

  return <MaterialReactTable table={table} />;
};

export default SuppAddresses;
