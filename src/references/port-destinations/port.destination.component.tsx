import { useEffect, useMemo, useState } from "react";

import { MRT_ColumnDef, MRT_PaginationState } from "material-react-table";
import { Box } from "@mui/material";

import { PortDestination } from "../../models/references/PortDestination";
import PortDestinationsTable from "./port.destination.table";
import { PaginationData } from "../../defs/defs";

import {
  SelectAllCountryPortDestinations,
  SelectTotal,
} from "../../sagaStore/port-destination/port-destination.selector";
import { SelectCountries } from "../../sagaStore/address/address.selector";

import { useGetAllCountryPortDestinations } from "../../data/custom.hooks.ts/apparel-pro.repository.hooks";

const PortDestinations = () => {
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

  const [portDestinations, setPortDestinations] = useState<PortDestination[]>(
    []
  );
  const [rowCount, setRowCount] = useState(0);

  const [validationErrors, setValidationErrors] =
    useState<Record<string, string | undefined>>();

  const validationRequired = (value: string) => !value?.length;

  //useCountries(paginate);

  // Method 2
  // const AllCountries = createSelector(
  //   (state: { country: { paginationAPIResult: { items: Country[] } } }) =>
  //     state.country.paginationAPIResult?.items,
  //   (items) =>
  //     items?.map((country: Country) => country.code + " - " + [country.name])
  // );

  const countries = SelectCountries(paginate);

  //const { isLoading, isError } = useGetPortDestinations(paginate, pagination);
  const { isLoading, isError } = useGetAllCountryPortDestinations(
    paginate,
    pagination
  );
  //const { isLoading, isError } = GetAllCountries(paginate, pagination);

  // const selectAllPorts = createSelector(
  //   [
  //     (state: {
  //       portDestination: {
  //         paginationAPIResult: {
  //           items: PortDestination[];
  //         };
  //       };
  //     }) => state.portDestination.paginationAPIResult,
  //   ],
  //   (paginationAPIResult) => paginationAPIResult?.items
  // );

  // const selectTotalPorts = createSelector(
  //   [
  //     (state: {
  //       portDestination: {
  //         paginationAPIResult: PaginationAPIModel<PortDestination>;
  //       };
  //     }) => state.portDestination.paginationAPIResult,
  //   ],
  //   (paginationAPIResult) => paginationAPIResult?.totalItems
  // );

  // const selectCurrentPageIndex = createSelector(
  //   [
  //     (state: {
  //       portDestination: {
  //         paginationAPIResult: PaginationAPIModel<PortDestination>;
  //       };
  //     }) => state.portDestination.paginationAPIResult,
  //   ],
  //   (paginationAPIResult) => paginationAPIResult?.currentPage
  // );

  // const selectAllPortsAndTotal = createSelector(
  //   [
  //     (state: {
  //       portDestination: {
  //         paginationAPIResult: {
  //           items: PortDestination[];
  //         };
  //       };
  //     }) =>
  //       state.portDestination.paginationAPIResult?.items, selectTotalPorts
  //         ,
  //   ],
  //   (result) => result
  // );
  // const selectAllCountryPortDestinations = useSelector(selectAllPorts);
  // const total = useSelector(selectTotalPorts);

  const selectAllCountryPortDestinations = SelectAllCountryPortDestinations(
    paginate,
    pagination
  );
  const selectPortDestinationsTotal = SelectTotal(paginate, pagination);
  //  const currentPageIndex = useSelector(selectCurrentPageIndex);
  //console.log("Page Index : ", currentPageIndex);
  // const selectPortsAndTotal = useSelector(selectAllPortsAndTotal);
  // console.log("selectAllPortsAndTotal : ", selectPortsAndTotal);
  //const selectAllCountryPortDestinations = selectAllPorts;
  //const count = selectAllPorts.resultsCount();

  //console.log("COUNT : ", count);
  // console.log(
  //   "selectAllCountryPortDestinations : ",
  //   selectAllCountryPortDestinations
  // );
  // console.log("selectTotalPorts : ", total);
  //  console.log("RESULT : ", res);

  // const selectAllCountryPortDestinationMemoized = useMemo(
  //   () => selectAllPorts,
  //   [selectAllPorts]
  // );
  // const selectAllCountryPortDestinations = useSelector(
  //   selectAllCountryPortDestinationMemoized
  // );

  useEffect(() => {
    if (selectAllCountryPortDestinations) {
      setPortDestinations(selectAllCountryPortDestinations);
      setRowCount(selectPortDestinationsTotal);
    }
  }, [selectAllCountryPortDestinations, selectPortDestinationsTotal]);

  const columns = useMemo<MRT_ColumnDef<PortDestination>[]>(
    () => [
      {
        accessorKey: "destinationName",
        header: "Destination Name",
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
    ],
    [validationErrors, countries]
  );

  return (
    <>
      <div className="border-2 border-gray-900 max-h-[700px] min-h-[650px]">
        <h1 className="text-center tracking-[0.4em] font-semibold p-4">
          New Port Destinations (Country Wise Destinations)
        </h1>

        <div className="flex justify-around">
          <PortDestinationsTable
            columns={columns}
            data={portDestinations}
            itemsCount={rowCount}
            setPortDestionationComponentPaginationState={(
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

export default PortDestinations;
