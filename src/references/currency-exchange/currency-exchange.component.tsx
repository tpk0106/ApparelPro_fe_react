import { useEffect, useMemo, useState } from "react";
import { CurrencyExchange } from "../../models/references/CurrencyExchange";
import { MRT_ColumnDef, MRT_PaginationState } from "material-react-table";
import { Box } from "@mui/material";
import { PaginationData } from "../../defs/defs";
import {
  useCurrencies,
  useGetCurrencyExchanges,
} from "../../data/custom.hooks.ts/apparel-pro.repository.hooks";
import { useSelector } from "react-redux";
import {
  SelectAllCurrencyExchanges,
  SelectTotal,
} from "../../sagaStore/currency-exchange/currency-exchange.selector";
import { selectAllCurrencyCodes } from "../../sagaStore/currency/currency.selector";
import CurrencyExchangeTable from "./currency-exchange.table";

const CurrencyExchanges = () => {
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

  const [CurrencyExchanges, setCurrencyExchanges] = useState<
    CurrencyExchange[]
  >([]);
  const [rowCount, setRowCount] = useState(0);

  const [validationErrors, setValidationErrors] =
    useState<Record<string, string | undefined>>();

  //const validationRequired = (value: string) => !value?.length;

  const { isLoading, isError } = useGetCurrencyExchanges(paginate, pagination);

  const currencyConversionList = SelectAllCurrencyExchanges(
    paginate,
    pagination
  );
  const CurrencyExchangesTotal = SelectTotal(paginate, pagination);

  useCurrencies(paginate);
  const currencies = useSelector(selectAllCurrencyCodes);
  console.log("CURR : ", currencies);

  useEffect(() => {
    if (currencyConversionList) {
      setCurrencyExchanges(currencyConversionList);
      setRowCount(CurrencyExchangesTotal);
    }
  }, [currencyConversionList, pagination, CurrencyExchangesTotal]);

  const columns = useMemo<MRT_ColumnDef<CurrencyExchange>[]>(
    () => [
      {
        accessorKey: "baseCurrency",
        header: "From Currency",
        size: 20,
        enableColumnActions: false,

        enableEditing: true,
        enableSorting: true,
        editVariant: "select",
        editSelectOptions: currencies,
        // Cell: ({ renderedCellValue }) => (
        //   <Box
        //     sx={{
        //       display: "flex",
        //     }}
        //   >
        //     <span>{renderedCellValue}</span>
        //   </Box>
        // ),
        muiEditTextFieldProps: {
          select: true,
          required: true,
          error: !!validationErrors?.baseCurrency,
          helperText: validationErrors?.baseCurrency,
          //children,

          // onBlur: (event) => {
          //   const validationError = validationRequired(
          //     event.currentTarget?.value
          //   )
          //     ? "required"
          //     : undefined;
          //   setValidationErrors({
          //     ...validationErrors,
          //     baseCurrency: undefined,
          //   });
          // },
          // onFocus: () => {
          //   setValidationErrors({
          //     ...validationErrors,
          //     baseCurrency: undefined,
          //   });
          // },
        },
        // columnFilterModeOptions: ["contains"],
      },
      {
        accessorKey: "quoteCurrency",
        header: "To Currency",
        size: 20,
        enableColumnActions: false,
        // enableColumnFilter: false,
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
        muiEditTextFieldProps: {
          select: true,
          required: true,
          error: !!validationErrors?.quoteCurrency,
          helperText: validationErrors?.quoteCurrency,
          //children,

          // onFocus: () => {
          //   setValidationErrors({
          //     ...validationErrors,
          //     quoteCurrency: undefined,
          //   });
          // },
          // onBlur: (event) => {
          //   const validationError = validationRequired(
          //     event.currentTarget?.value
          //   )
          //     ? "required"
          //     : undefined;
          //   setValidationErrors({
          //     ...validationErrors,
          //     [cell.id]: validationError,
          //   });
          // },
        },
        columnFilterModeOptions: ["contains"],
      },
      {
        accessorKey: "exchangeDate",
        header: "Exchange Date",
        size: 300,
        enableEditing: true,
        enableSorting: false,
        enableColumnFilter: false,
        filterVariant: "date",
        id: "exchangeDate",
        accessorFn: (row) => new Date(row.exchangeDate),

        // Cell: ({ cell }) => {
        //   cell.getValue<Date>().toLocaleDateString();
        // },

        Cell: ({ cell }) => (
          <Box
            sx={{
              display: "flex",
            }}
          >
            {cell.getValue<Date>().toLocaleDateString()}
          </Box>
        ),

        muiEditTextFieldProps: {
          type: "date",
          required: true,
          error: !validationErrors?.exchangeDate,
          helperText: validationErrors?.exchangeDate,
          //  style: { textTransform: "uppercase" },
          //   onChange: handleChange,
          //   value: val,
          // onKeyUpCapture: (e) => {
          //   cell.renderValue(e.target.value.toUpperCase());
          //   console.log("key up", e.target.value);
          // },
          //  slotProps: { textTransform: "upperCase" },
          // onBlur: (event) => {
          //   const validationError = validationRequired(
          //     event.currentTarget.value
          //   )
          //     ? "required"
          //     : undefined;
          //   setValidationErrors({
          //     ...validationErrors,
          //     [cell.id]: validationError,
          //   });
          // },
          onFocus: () => {
            setValidationErrors({
              ...validationErrors,
              exchangeDate: undefined,
            });
          },
        },
      },
      {
        accessorKey: "rate",
        header: "Rate",
        size: 300,
        enableEditing: true,
        enableSorting: false,
        enableColumnFilter: false,

        Cell: ({ renderedCellValue }) => (
          <Box
            sx={{
              display: "flex",
            }}
          >
            <span>{renderedCellValue?.toString()}</span>
          </Box>
        ),

        muiEditTextFieldProps: {
          type: "text",
          required: true,
          error: !validationErrors?.rate,
          helperText: validationErrors?.rate,
          onFocus: () => {
            setValidationErrors({
              ...validationErrors,
              rate: undefined,
            });
          },
          //  style: { textTransform: "uppercase" },
          //   onChange: handleChange,
          //   value: val,
          // onKeyUpCapture: (e) => {
          //   cell.renderValue(e.target.value.toUpperCase());
          //   console.log("key up", e.target.value);
          // },
          //  slotProps: { textTransform: "upperCase" },
          // onBlur: (event) => {
          //   const validationError = validationRequired(
          //     event.currentTarget.value
          //   )
          //     ? "required"
          //     : undefined;
          //   setValidationErrors({
          //     ...validationErrors,
          //     [cell.id]: validationError,
          //   });
          // },
        },
      },
    ],
    [validationErrors, currencies]
  );

  return (
    <>
      <div className="border-2 border-gray-900 max-h-[700px] min-h-[650px]">
        <h1 className="text-center tracking-[0.4em] font-semibold p-4">
          New Currency Exchange
        </h1>

        <div className="flex justify-around">
          <CurrencyExchangeTable
            columns={columns}
            data={CurrencyExchanges}
            itemsCount={rowCount}
            setCurrencyExchangeComponentPaginationState={(
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

export default CurrencyExchanges;
