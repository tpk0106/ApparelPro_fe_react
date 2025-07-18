import { Box } from "@mui/material";
import { MRT_ColumnDef, MRT_PaginationState } from "material-react-table";
import { useEffect, useMemo, useState } from "react";

import { Supplier } from "../../models/references/Supplier";
import SupplierTable from "./supplier.table";
import { PaginationData } from "../../defs/defs";
import { useGetSuppliers } from "../../data/custom.hooks.ts/apparel-pro.repository.hooks";

import {
  SelectAllSuppliers,
  SelectTotal,
} from "../../sagaStore/supplier/supplier.selector";

const Suppliers = () => {
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

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [rowCount, setRowCount] = useState(5);

  const [validationErrors, setValidationErrors] =
    useState<Record<string, string | undefined>>();

  const validationRequired = (value: string) => !value?.length;

  const columns = useMemo<MRT_ColumnDef<Supplier>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Supplier Name",
        size: 300,
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
    ],
    [validationErrors]
  );

  const { isLoading, isError } = useGetSuppliers(paginate, pagination);
  const suppliersLits = SelectAllSuppliers(paginate, pagination);
  const supplierTotal = SelectTotal(paginate, pagination);

  useEffect(() => {
    if (suppliersLits) {
      setSuppliers(suppliersLits);
      setRowCount(supplierTotal);
    }
  }, [suppliersLits, pagination, supplierTotal]);

  return (
    <>
      <div className="border-2 border-gray-900 max-h-[700px] min-h-[650px]">
        <h1 className="text-center tracking-[0.4em] font-semibold p-4">
          Supplier
        </h1>

        <div className="flex justify-around">
          <SupplierTable
            columns={columns}
            data={suppliers}
            itemsCount={rowCount}
            setSupplierComponentPaginationState={(
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

export default Suppliers;
