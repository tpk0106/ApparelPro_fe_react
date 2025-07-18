import { useEffect, useMemo, useState } from "react";

import { MRT_ColumnDef, MRT_PaginationState } from "material-react-table";
import { Box } from "@mui/material";

import { PaginationData } from "../../defs/defs";

import { useGetUnits } from "../../data/custom.hooks.ts/apparel-pro.repository.hooks";
import UnitsTable from "./unit.table.component";
import { Unit } from "../../models/references/Unit";
import {
  SelectAllUnits,
  SelectUnitsTotal,
} from "../../sagaStore/unit/unit.selector";

const Units = () => {
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

  const [units, setUnits] = useState<Unit[]>([]);
  const [rowCount, setRowCount] = useState(0);

  const [validationErrors, setValidationErrors] =
    useState<Record<string, string | undefined>>();

  const validationRequired = (value: string) => !value?.length;

  const { isLoading, isError } = useGetUnits(paginate, pagination);

  const unitList = SelectAllUnits(paginate, pagination);
  const unitsTotal = SelectUnitsTotal(paginate, pagination);

  useEffect(() => {
    if (unitList) {
      setUnits(unitList);
      setRowCount(unitsTotal);
    }
  }, [unitList, pagination, unitsTotal]);

  const columns = useMemo<MRT_ColumnDef<Unit>[]>(
    () => [
      {
        accessorKey: "code",
        header: "Unit Code",
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
        accessorKey: "description",
        header: "Description",
        size: 500,
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
    [validationErrors]
  );
  return (
    <>
      <div className="border-2 border-gray-900 max-h-[700px] min-h-[650px]">
        <h1 className="text-center tracking-[0.4em] font-semibold p-4">
          Units
        </h1>

        <div className="flex justify-around">
          <UnitsTable
            columns={columns}
            data={units}
            itemsCount={rowCount}
            setUnitComponentPaginationState={(
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

export default Units;
