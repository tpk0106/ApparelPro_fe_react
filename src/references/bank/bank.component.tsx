import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { MRT_ColumnDef, MRT_PaginationState } from "material-react-table";
import { Box } from "@mui/material";

import Bank from "../../models/references/Bank";
import {
  SelectAllBanks,
  SelectBanksTotal,
} from "../../sagaStore/bank/bank.selector";
import BankTable from "./bank.table.component";

import {
  useCurrencies,
  useGetBanks,
} from "../../data/custom.hooks.ts/apparel-pro.repository.hooks";
import { PaginationData } from "../../defs/defs";
import { selectAllCurrencyCodes } from "../../sagaStore/currency/currency.selector";

const Banks = () => {
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

  const [banks, setBanks] = useState<Bank[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [validationErrors, setValidationErrors] =
    useState<Record<string, string | undefined>>();

  const validationRequired = (value: string) => !value?.length;

  const { isLoading, isError } = useGetBanks(paginate, pagination);

  const selectAllBanks = SelectAllBanks(paginate, pagination);
  const selectBankTotal = SelectBanksTotal(paginate, pagination);

  useCurrencies(paginate);
  const currencies = useSelector(selectAllCurrencyCodes);

  useEffect(() => {
    if (selectAllBanks) {
      setBanks(selectAllBanks);
      setRowCount(selectBankTotal);
    }
  }, [selectAllBanks, selectBankTotal, pagination]);

  const columns = useMemo<MRT_ColumnDef<Bank>[]>(
    () => [
      {
        accessorKey: "bankCode",
        header: "Code",
        size: 30,
        enableEditing: (row) => row.original.bankCode?.length == 0,
        Cell: ({ renderedCellValue }) => (
          <Box
            sx={{
              display: "flex",
            }}
          >
            <span>{renderedCellValue}</span>
          </Box>
        ),
        columnFilterModeOptions: ["contains"],
      },
      {
        accessorKey: "name",
        header: "Bank Name",
        size: 300,
        enableEditing: true,
        enableSorting: false,

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
          type: "text",
          required: true,
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
        accessorKey: "swiftCode",
        header: "SwiftCode",
        size: 30,
        enableEditing: true,
        enableColumnFilterModes: false,
        enableColumnFilter: false,
        enableSorting: false,
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
          type: "text",
          required: true,
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
        accessorKey: "telephoneNos",
        header: "Tel.",
        size: 30,
        enableEditing: true,
        enableColumnFilterModes: false,
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ renderedCellValue }) => (
          <Box
            sx={{
              display: "flex",
            }}
          >
            <span>{renderedCellValue}</span>
          </Box>
        ),
      },
      {
        accessorKey: "loanLimit",
        header: "Loan Limit",
        size: 50,
        enableEditing: true,
        enableColumnFilterModes: false,
        enableColumnFilter: false,
        enableSorting: false,
        Cell: ({ renderedCellValue }) => (
          <Box
            sx={{
              display: "flex",
            }}
          >
            <span>{renderedCellValue}</span>
          </Box>
        ),
      },
      {
        accessorKey: "currencyCode",
        header: "Currency Code",
        size: 30,
        enableEditing: true,
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
          //  children,

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
    [currencies, validationErrors]
  );

  return (
    <>
      <div className="border-2 border-gray-900 max-h-[700px] min-h-[650px]">
        <h1 className="text-center tracking-[0.4em] font-semibold p-4">Bank</h1>

        <div className="flex justify-around">
          <BankTable
            columns={columns}
            data={banks}
            itemsCount={rowCount}
            setBankComponentPaginationState={(
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

export { Banks };
// https://stackoverflow.com/questions/77480539/how-to-change-pagination-in-materialreacttable-by-resizing-the-grid-that-is-crea
// https://www.bacancytechnology.com/qanda/react/material-react-table-with-searchable-dropdown
