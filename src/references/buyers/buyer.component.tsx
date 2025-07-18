import { useState, useEffect, useMemo } from "react";
import { MRT_ColumnDef, MRT_PaginationState } from "material-react-table";
import { Box } from "@mui/material";

import { Buyer } from "../../models/references/Buyer";
import { useGetBuyers } from "./custom.hooks.ts";
import {
  SelectAllBuyers,
  SelectBuyersTotal,
} from "../../sagaStore/buyer/buyer.selector";
import BuyerTable from "./buyer.table.component";
import { PaginationData } from "../../defs/defs.ts";

const Buyers = () => {
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

  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [validationErrors, setValidationErrors] =
    useState<Record<string, string | undefined>>();

  const validationRequired = (value: string) => !value?.length;

  const { isLoading, isError } = useGetBuyers(paginate, pagination);
  const buyersList = SelectAllBuyers(paginate, pagination);
  const buyersTotal = SelectBuyersTotal(paginate, pagination);

  useEffect(() => {
    if (buyersList) {
      setBuyers(buyersList);
      setRowCount(buyersTotal);
    }
  }, [buyersList, pagination, buyersTotal]);
  // const [val, setVal] = useState("");
  // const handleChange = (e: any) => {
  //   setVal(e.target?.value.toUpperCase());
  //   //e.target.onChange(e);
  // };

  const columns = useMemo<MRT_ColumnDef<Buyer>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Buyer Name",
        size: 300,
        enableEditing: true,
        enableSorting: false,

        Cell: ({ renderedCellValue }) => (
          <Box
            sx={{
              display: "flex",
            }}
          >
            <span>{renderedCellValue?.toString().toUpperCase()}</span>,
          </Box>
        ),

        muiEditTextFieldProps: ({ cell }) => ({
          type: "text",
          required: true,
          style: { textTransform: "uppercase" },
          //   onChange: handleChange,
          //   value: val,
          // onKeyUpCapture: (e) => {
          //   cell.renderValue(e.target.value.toUpperCase());
          //   console.log("key up", e.target.value);
          // },
          //  slotProps: { textTransform: "upperCase" },
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
        accessorKey: "status",
        header: "Status",
        size: 30,
        enableEditing: true,
        editVariant: "select",
        editSelectOptions: ["BO", "BC", "NP", "AG"],
        enableColumnFilterModes: true,
        enableColumnFilter: true,
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
      {
        accessorKey: "telephoneNos",
        header: "Tel.",
        size: 150,
        enableEditing: true,
        enableColumnFilterModes: false,
        enableColumnFilter: false,
        enableSorting: false,
        enableColumnActions: false,
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
        accessorKey: "mobileNos",
        header: "Mobile.",
        size: 150,
        enableEditing: true,
        enableColumnFilterModes: false,
        enableColumnFilter: false,
        enableSorting: false,
        enableColumnActions: false,
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
        accessorKey: "fax",
        header: "Fax",
        size: 150,
        enableEditing: true,
        enableColumnFilterModes: false,
        enableColumnFilter: false,
        enableSorting: false,
        enableColumnActions: false,
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
        accessorKey: "cusdec",
        header: "CUSDEC",
        size: 30,
        enableEditing: true,
        enableColumnFilterModes: false,
        enableColumnFilter: false,
        enableSorting: false,
        enableColumnActions: false,

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
    ],
    [validationErrors]
  );

  return (
    <>
      <div className="border-2 border-gray-900 max-h-[700px] min-h-[650px]">
        <h1 className="text-center tracking-[0.4em] font-semibold p-4">
          Buyer
        </h1>

        <div className="flex justify-around">
          <BuyerTable
            columns={columns}
            data={buyers}
            itemsCount={rowCount}
            setBuyerComponentPaginationState={(
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

export default Buyers;
