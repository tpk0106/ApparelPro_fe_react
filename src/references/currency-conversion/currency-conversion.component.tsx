import { useEffect, useMemo, useState } from "react";

import { MRT_ColumnDef, MRT_PaginationState } from "material-react-table";
import { Box } from "@mui/material";

import { PaginationData } from "../../defs/defs";

import { SelectTotal } from "../../sagaStore/garment-type/garment-type.selector";

import {
  useCurrencies,
  useGetCurrencyConversions,
} from "../../data/custom.hooks.ts/apparel-pro.repository.hooks";
import { CurrencyConversion } from "../../models/references/CurrencyConversion";
import { useSelector } from "react-redux";
import { selectAllCurrencyCodes } from "../../sagaStore/currency/currency.selector";
import { SelectAllCurrencyConversions } from "../../sagaStore/currency-conversion/currency-conversion.selector";
import CurrencyConversionsTable from "./currency-conversion.table";

const CurrencyConversions = () => {
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

  const [currencyConversions, setCurrencyConversions] = useState<
    CurrencyConversion[]
  >([]);
  const [rowCount, setRowCount] = useState(0);

  const [validationErrors, setValidationErrors] =
    useState<Record<string, string | undefined>>();

  const validationRequired = (value: string) => !value?.length;

  const { isLoading, isError } = useGetCurrencyConversions(
    paginate,
    pagination
  );

  const currencyConversionList = SelectAllCurrencyConversions(
    paginate,
    pagination
  );
  const currencyConversionsTotal = SelectTotal(paginate, pagination);

  useCurrencies(paginate);
  const currencies = useSelector(selectAllCurrencyCodes);

  useEffect(() => {
    if (currencyConversionList) {
      setCurrencyConversions(currencyConversionList);
      setRowCount(currencyConversionsTotal);
    }
  }, [currencyConversionList, pagination, currencyConversionsTotal]);

  const columns = useMemo<MRT_ColumnDef<CurrencyConversion>[]>(
    () => [
      {
        accessorKey: "fromCurrency",
        header: "From Currency",
        size: 10,
        enableColumnActions: false,
        enableColumnFilter: false,
        editVariant: "select",
        editSelectOptions: currencies,
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
        accessorKey: "toCurrency",
        header: "To Currency",
        size: 10,
        enableColumnActions: false,
        enableColumnFilter: false,
        editVariant: "select",
        editSelectOptions: currencies,
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
    ],
    [validationErrors]
  );
  return (
    <>
      <div className="border-2 border-gray-900 max-h-[700px] min-h-[650px]">
        <h1 className="text-center tracking-[0.4em] font-semibold p-4">
          New Garment Type
        </h1>

        <div className="flex justify-around">
          <CurrencyConversionsTable
            columns={columns}
            data={currencyConversions}
            itemsCount={rowCount}
            setCurrencyConversionComponentPaginationState={(
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

export default CurrencyConversions;
