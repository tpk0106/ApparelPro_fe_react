//MRT Imports

import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  //MRT_GlobalFilterTextField,
  //MRT_ToggleFiltersButton,
} from "material-react-table";

import {
  Box,
  Button,
  //ListItemIcon,
  //MenuItem,
  Typography,
  //lighten,
} from "@mui/material";

//Icons Imports

//import { AccountCircle, Send } from "@mui/icons-material";
import { useMemo } from "react";

import { Country } from "../../models/references/Country";
//import { PaginationAPIModel } from "../../models/references/ApiResult";

const imageDataUrl = (data: unknown): string => {
  const url: string = "data:image/jpeg;base64," + data;
  return url;
};
//const Table = (data: PaginationAPIModel<Country>) => {
const Table = (data: Country[]) => {
  const columns = useMemo<MRT_ColumnDef<Country>[]>(
    () => [
      {
        id: "countries",
        header: "Countries",
        columns: [
          {
            // accessorFn: (row) => `${row.name}`,
            id: "name",
            header: "Name",
            accessorKey: "name",
            enableEditing: true,
            size: 250,
            Cell: ({ renderedCellValue }) => (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  // backgroundColor: "#000",
                  // color: "#42a5f5",
                  height: "30px",
                }}
              >
                <span>{renderedCellValue}</span>
              </Box>
            ),
          },
        ],
      },
      {
        id: "code",
        header: "Code",
        columns: [
          {
            accessorKey: "code",
            enableClickToCopy: true,
            header: "Code",
            size: 300,
            Cell: ({ renderedCellValue }) => (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  // backgroundColor: "#000",
                  // color: "#42a5f5",
                  height: "30px",
                }}
              >
                <span>{renderedCellValue}</span>
              </Box>
            ),
          },
        ],
      },
      {
        id: "flag",
        header: "Flag",
        columns: [
          {
            accessorKey: "flag",
            enableClickToCopy: true,
            header: "Flag",
            size: 300,
            Cell: ({ renderedCellValue }) => (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <img
                  src={imageDataUrl(renderedCellValue)}
                  className="w-8 h-[20px] my-auto mt-0 rounded-sm"
                />
              </Box>
            ),
          },
        ],
      },
      // {
      //   id: "id",
      //   header: "Id",
      //   enableEditing: false,
      //   columns: [
      //     {
      //       accessorKey: "id",
      //       enableClickToCopy: true,
      //       header: "Id",
      //       size: 80,
      //       Cell: ({ renderedCellValue }) => (
      //         <Box
      //           sx={{
      //             display: "flex",
      //             alignItems: "center",
      //             gap: "1rem",
      //             backgroundColor: "#000",
      //             color: "#42a5f5",
      //             height: "30px",
      //           }}
      //         >
      //           <span>{renderedCellValue}</span>
      //         </Box>
      //       ),
      //     },
      //   ],
      // },
    ],
    []
  );

  //const { items } = data;

  const table = useMaterialReactTable({
    columns,
    ...data,
    // displayColumnDefOptions: { "mrt-row-actions": { size: 100 } }, //change width of actions column to 300px
    // enableRowActions: true,
    // renderRowActions: ({ row }) => (
    //   <Box>
    //     <Button>Action 1</Button>
    //   </Box>
    // ),
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableGrouping: true,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowSelection: true,
    muiTableHeadRowProps: {
      style: {
        backgroundColor: "#808080",
        color: "##fff",
      },
    },
    muiTableBodyRowProps: {
      style: {
        backgroundColor: "#000",
        color: "##42a5f5",
      },
    },

    // initialState: {
    //   showColumnFilters: true,
    //   showGlobalFilter: true,
    //   columnPinning: {
    //     left: ["mrt-row-expand", "mrt-row-select"],
    //     right: ["mrt-row-actions"],
    //   },
    // },
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "bottom",
    muiSearchTextFieldProps: {
      size: "small",
      variant: "outlined",
    },
    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [10, 20, 30],
      shape: "rounded",
      variant: "outlined",
    },
    // renderDetailPanel: ({ row }: any) => (
    //   <Box
    //     sx={{
    //       alignItems: "center",
    //       display: "flex",
    //       justifyContent: "space-around",
    //       left: "30px",
    //       maxWidth: "1000px",
    //       position: "sticky",
    //       width: "100%",
    //       backgroundColor: "#f6f6",
    //     }}
    //   >
    //     <Box sx={{ textAlign: "center" }}>
    //       <Typography variant="h4">Signature Catch Phrase:</Typography>
    //       <Typography variant="h1">
    //         &quot;{row.original.signatureCatchPhrase}&quot;
    //       </Typography>
    //     </Box>
    //   </Box>
    // ),
  });
  return <MaterialReactTable table={table} />;
};

export default Table;
