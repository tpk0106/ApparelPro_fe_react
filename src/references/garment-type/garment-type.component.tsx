import { useEffect, useMemo, useState } from "react";

import { MRT_ColumnDef, MRT_PaginationState } from "material-react-table";
import { Box } from "@mui/material";

import GarmentTypesTable from "./garment-type.table.component";
import { PaginationData } from "../../defs/defs";

import {
  SelectAllGarmentTypes,
  SelectTotal,
} from "../../sagaStore/garment-type/garment-type.selector";
import { GarmentType } from "../../models/references/GarmentType";
import { useGetGarmentTypes } from "../../data/custom.hooks.ts/apparel-pro.repository.hooks";

const GarmentTypes = () => {
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

  const [garmentTypes, setGarmentTypes] = useState<GarmentType[]>([]);
  const [rowCount, setRowCount] = useState(0);

  const [validationErrors, setValidationErrors] =
    useState<Record<string, string | undefined>>();

  const validationRequired = (value: string) => !value?.length;

  const { isLoading, isError } = useGetGarmentTypes(paginate, pagination);

  const garmentTypeList = SelectAllGarmentTypes(paginate, pagination);
  const garmentTypesTotal = SelectTotal(paginate, pagination);

  useEffect(() => {
    if (garmentTypeList) {
      setGarmentTypes(garmentTypeList);
      setRowCount(garmentTypesTotal);
    }
  }, [garmentTypeList, pagination, garmentTypesTotal]);

  const columns = useMemo<MRT_ColumnDef<GarmentType>[]>(
    () => [
      {
        accessorKey: "typeName",
        header: "Type Name",
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
          New Garment Type
        </h1>

        <div className="flex justify-around">
          <GarmentTypesTable
            columns={columns}
            data={garmentTypes}
            itemsCount={rowCount}
            setGarmentTypeComponentPaginationState={(
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

export default GarmentTypes;
