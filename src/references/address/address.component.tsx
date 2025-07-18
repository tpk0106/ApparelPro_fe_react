import { Box } from "@mui/material";

import { MRT_ColumnDef, MRT_PaginationState } from "material-react-table";
import { useEffect, useMemo, useState } from "react";
import AddressTable from "./address.table";
import { Address } from "../../models/references/Address";
import { PaginationData } from "../../defs/defs";
import { useGetBuyers } from "../buyers/custom.hooks";

const Addresses = (addressData: Address[] | undefined) => {
  const paginate: PaginationData = {
    pageNumber: 0,
    pageSize: 10,
    sortColumn: null,
    sortOrder: null,
    filterColumn: null,
    filterQuery: null,
  };

  //const [addresses, setAddresses] = useState<Address[]>();
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  console.log("DATA --------------------------->", addressData!);
  // console.log("addresses --------------------------->", addresses!);

  useEffect(() => {
    if (addressData) {
      //  setBuyerData(buyers);
      // console.log("ADDRESS DATA : ", addressData!);
      setRowCount(addressData.length);
    }
  }, [addressData]);

  //const [buyerData, setBuyerData] = useState<Buyer2[]>([]);
  //const [addressData, setAddressData] = useState<Address[]>([]);
  //const [addressId, setAddressId] = useState<string>();
  const [rowCount, setRowCount] = useState(0);
  const [validationErrors, setValidationErrors] =
    useState<Record<string, string | undefined>>();

  const validationRequired = (value: string) => !value?.length;

  const { isLoading, isError } = useGetBuyers(paginate, pagination);

  const columns = useMemo<MRT_ColumnDef<Address>[]>(
    () => [
      {
        accessorKey: "addressId",
        header: "ID",
        size: 30,
      },
      {
        accessorKey: "streetAddress",
        header: "Street Address",
        size: 300,
      },
      {
        accessorKey: "city",
        header: "City",
        size: 30,
        enableEditing: true,
      },
      {
        accessorKey: "postCode",
        header: "Post Code",
        size: 100,
      },
      {
        accessorKey: "state",
        header: "State",
        size: 100,
      },
      {
        accessorKey: "countryCode",
        header: "Country",
        size: 150,
      },
    ],
    []
  );

  return (
    <>
      <div className="border-2 border-gray-900 max-h1-[700px] min1-h-[650px]">
        <h1 className="text-center tracking-[0.4em] font-semibold p-4">
          Address
        </h1>

        {/* {isLoading && <div>loading</div>} */}
        <div className="flex justify-around">
          <AddressTable
            columns={columns}
            data={addressData}
            itemsCount={rowCount}
            // setAddressComponentPaginationState={(
            //   pageIndex: number,
            //   pageSize: number
            // ) => {
            //   setPagination((prevPagination: any) => {
            //     //  console.log("new pagination :", pageIndex, pageSize);
            //     const newState = {
            //       ...prevPagination,
            //       pageIndex: pageIndex,
            //       pageSize: pageSize,
            //     };
            //     return newState;
            //   });
            // }}
            isError={isError}
            // paginate={paginate}
            // pagination={pagination}
          />
        </div>
      </div>
    </>
  );
};

export default Addresses;

// {
//     accessorKey: "streetAddress",
//     header: "Street Address",
//     size: 300,
//     enableEditing: true,
//     enableSorting: false,

//     Cell: ({ renderedCellValue }) => (
//       <Box
//         sx={{
//           display: "flex",
//         }}
//       >
//         <span>{renderedCellValue}</span>,
//       </Box>
//     ),

//     muiEditTextFieldProps: ({ cell }) => ({
//       type: "text",
//       required: true,

//       onBlur: (event) => {
//         const validationError = validationRequired(
//           event.currentTarget.value
//         )
//           ? "required"
//           : undefined;
//         setValidationErrors({
//           ...validationErrors,
//           [cell.id]: validationError,
//         });
//       },
//     }),
//   },
//   {
//     accessorKey: "city",
//     header: "City",
//     size: 30,
//     enableEditing: true,

//     enableColumnFilterModes: true,
//     enableColumnFilter: true,
//     enableSorting: false,
//     Cell: ({ renderedCellValue }) => (
//       <Box
//         sx={{
//           display: "flex",
//         }}
//       >
//         <span>{renderedCellValue}</span>
//       </Box>
//     ),
//     muiEditTextFieldProps: ({ cell }) => ({
//       select: true,
//       required: true,
//       error: !!validationErrors?.state,
//       helperText: validationErrors?.state,
//       //  children,

//       onBlur: (event) => {
//         const validationError = validationRequired(
//           event.currentTarget?.value
//         )
//           ? "required"
//           : undefined;
//         setValidationErrors({
//           ...validationErrors,
//           [cell.id]: validationError,
//         });
//       },
//     }),
//     columnFilterModeOptions: ["contains"],
//   },
//   {
//     accessorKey: "postCode",
//     header: "Post Code",
//     size: 100,
//     enableEditing: true,
//     enableColumnFilterModes: false,
//     enableColumnFilter: false,
//     enableSorting: false,
//     Cell: ({ renderedCellValue }) => (
//       <Box
//         sx={{
//           display: "flex",
//         }}
//       >
//         <span>{renderedCellValue}</span>
//       </Box>
//     ),
//   },
//   {
//     accessorKey: "state",
//     header: "State",
//     size: 100,
//     enableEditing: true,
//     enableColumnFilterModes: false,
//     enableColumnFilter: false,
//     enableSorting: false,
//     Cell: ({ renderedCellValue }) => (
//       <Box
//         sx={{
//           display: "flex",
//         }}
//       >
//         <span>{renderedCellValue}</span>
//       </Box>
//     ),
//   },
//   {
//     accessorKey: "countryCode",
//     header: "Country",
//     size: 150,
//     enableEditing: true,
//     enableColumnFilterModes: false,
//     enableColumnFilter: false,
//     enableSorting: false,
//     Cell: ({ renderedCellValue }) => (
//       <Box
//         sx={{
//           display: "flex",
//         }}
//       >
//         <span>{renderedCellValue}</span>
//       </Box>
//     ),
//   },
//   {
//     accessorKey: "default",
//     header: "Default Address",
//     size: 30,
//     enableEditing: true,
//     enableColumnFilterModes: false,
//     enableColumnFilter: false,
//     Cell: ({ renderedCellValue }) => (
//       <Box
//         sx={{
//           display: "flex",
//         }}
//       >
//         <span>{renderedCellValue}</span>
//       </Box>
//     ),
//   },
