import { useEffect, useMemo, useState } from "react";

import { MRT_ColumnDef, MRT_PaginationState } from "material-react-table";
import { Box } from "@mui/material";

import { PaginationData } from "../../defs/defs";

import { SelectCountries } from "../../sagaStore/address/address.selector";

import CurrencyTable from "./currency.table.component";
import {
  SelectAllCurrencies,
  SelectCurrenciesTotal,
} from "../../sagaStore/currency/currency.selector";
import { Currency } from "../../models/references/Currency";
import { useGetCurrencies } from "../../data/custom.hooks.ts/apparel-pro.repository.hooks";

const Currencies = () => {
  const paginate: PaginationData = {
    pageNumber: 0,
    pageSize: 5,
    sortColumn: null,
    sortOrder: null,
    filterColumn: null,
    filterQuery: null,
  };

  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [rowCount, setRowCount] = useState(0);

  const [validationErrors, setValidationErrors] =
    useState<Record<string, string | undefined>>();

  const validationRequired = (value: string) => !value?.length;

  const countries = SelectCountries(paginate);

  const { isLoading, isError } = useGetCurrencies(paginate, pagination);

  const selectAllCountryCurrencies = SelectAllCurrencies(paginate);
  const selectCurrenciesTotal = SelectCurrenciesTotal(paginate);

  useEffect(() => {
    if (selectAllCountryCurrencies) {
      setCurrencies(selectAllCountryCurrencies);
      setRowCount(selectCurrenciesTotal);
    }
  }, [selectAllCountryCurrencies, selectCurrenciesTotal]);

  const columns = useMemo<MRT_ColumnDef<Currency>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Currency Name",
        size: 400,
        enableEditing: true,
        enableSorting: false,

        Cell: ({ renderedCellValue }) => (
          <Box
            sx={{
              display: "flex",
            }}
          >
            <span>{renderedCellValue?.toString().toUpperCase()}</span>
          </Box>
        ),

        muiEditTextFieldProps: ({ cell }) => ({
          type: "text",
          required: true,
          style: { textTransform: "uppercase" },

          onBlur: (event) => {
            const validationError = validationRequired(
              event.currentTarget.value
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
      {
        accessorKey: "code",
        header: "Currency Code",
        size: 100,
        enableEditing: true,
        enableSorting: false,

        Cell: ({ renderedCellValue }) => (
          <Box
            sx={{
              display: "flex",
            }}
          >
            <span>{renderedCellValue?.toString().toUpperCase()}</span>
          </Box>
        ),

        muiEditTextFieldProps: ({ cell }) => ({
          type: "text",
          required: true,
          style: { textTransform: "uppercase" },

          onBlur: (event) => {
            const validationError = validationRequired(
              event.currentTarget.value
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
      {
        accessorKey: "countryCode",
        header: "Country",
        size: 50,
        enableEditing: (row) => row.original.countryCode?.length == 0,
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
        accessorKey: "minor",
        header: "Minor",
        size: 100,
        enableEditing: true,
        enableSorting: false,

        Cell: ({ renderedCellValue }) => (
          <Box
            sx={{
              display: "flex",
            }}
          >
            <span>{renderedCellValue?.toString().toUpperCase()}</span>
          </Box>
        ),

        muiEditTextFieldProps: ({ cell }) => ({
          type: "text",
          required: true,
          style: { textTransform: "uppercase" },

          onBlur: (event) => {
            const validationError = validationRequired(
              event.currentTarget.value
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

  return (
    <>
      <div className="border-2 border-gray-900 max-h-[700px] min-h-[650px]">
        <h1 className="text-center tracking-[0.4em] font-semibold p-4">
          Currencies
        </h1>

        <div className="flex justify-around">
          <CurrencyTable
            columns={columns}
            data={currencies}
            itemsCount={rowCount}
            setCurrencyComponentPaginationState={(
              pageIndex: number,
              pageSize: number
            ) => {
              setPagination((prevPagination) => {
                const newState = {
                  ...prevPagination,
                  pageIndex: pageIndex,
                  pageSize: pageSize,
                };
                return newState;
              });
            }}
            isError={isError}
            isLoading={isLoading}
            paginate={paginate}
            pagination={pagination}
          />
        </div>
      </div>
    </>
  );
};

export default Currencies;
