import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCountryStart,
  deleteCountryStart,
  loadAllCountriesStart,
  updateCountryStart,
} from "../../sagaStore/country/country.action";

//MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  MRT_TableOptions,
  MRT_Row,
} from "material-react-table";

import {
  Box,
  Button,
  IconButton,
  Typography,
  darken,
  CircularProgress,
  Tooltip,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { Country } from "../../models/references/Country";
import { getAllCountries } from "../../sagaStore/country/country.selector";
import { PaginationData } from "../../defs/defs";

const imageDataUrl = (data: unknown): string => {
  const url: string = "data:image/jpeg;base64," + data;
  return url;
};

const validationRequired = (value: string) => !value.length;
const validateCountry = ({ name }: Country) => {
  return {
    name: validationRequired(name) ? "country name required" : "",
  };
};

//const Table = (data: Country[]) => {
const Table = () => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const [editedCountries, setEditedCountries] = useState<
    Record<string, Country>
  >({});

  // const pagination: PaginationData = {
  //   pageNumber: 0,
  //   pageSize: 10,
  //   sortColumn: null,
  //   sortOrder: null,
  //   filterColumn: null,
  //   filterQuery: null,
  // };

  const [pagination, setPagination] = useState<PaginationData>({
    pageIndex: 0,
    pageNumber: 0,
    pageSize: 10,
    sortColumn: null,
    sortOrder: null,
    filterColumn: null,
    filterQuery: null,
  });

  const [page, setPage] = useState({ pageIndex: 0, pageSize: 5 });

  const dispatch = useDispatch();
  const countryPaginationAPIModel = useSelector(getAllCountries);

  const columns = useMemo<MRT_ColumnDef<Country>[]>(
    () => [
      {
        accessorKey: "id",
        enableEditing: false,
        header: "Id",
        size: 30,
        Cell: ({ renderedCellValue }) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              height: "30px",
            }}
          >
            <span>{renderedCellValue}</span>
          </Box>
        ),
      },
      {
        accessorKey: "code",
        enableEditing: false,
        header: "Code",
        size: 100,
        Cell: ({ renderedCellValue }) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",

              height: "30px",
            }}
          >
            <span>{renderedCellValue}</span>
          </Box>
        ),
      },
      {
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
              height: "30px",
            }}
          >
            <span>{renderedCellValue}</span>
          </Box>
        ),
        muiEditTextFieldProps: ({ cell, row }) => ({
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
            setEditedCountries({ ...editedCountries, [row.id]: row.original });
          },
        }),
      },

      {
        accessorKey: "flag",
        enableEditing: false,
        header: "Flag",
        size: 100,
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
        muiEditTextFieldProps: {
          required: true,
        },
      },
    ],
    []
  );

  // <------- CRUD Operations  ------>

  //READ hook (get users from api)
  function useGetCountries() {
    return useQuery<Country[]>({
      queryKey: ["countries"],

      queryFn: async () => {
        //send api request here
        dispatch(loadAllCountriesStart({ ...pagination, ...page }));
        return countryPaginationAPIModel.items;
      },
      refetchOnWindowFocus: false,
    });
  }

  //UPDATE hook (put user in api)
  //const useUpdateCountry = (): UseMutationResult<Country, any, any, any> => {
  const useUpdateCountry = (): any => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async ({ ...country }: Country) => {
        //send api update request here
        const res = dispatch(updateCountryStart({ ...country }));
        return res.payload;
      },

      //client side optimistic update
      onMutate: (newCountry: Country) => {
        queryClient.setQueryData(["countries"], (prevCountries: Country[]) =>
          prevCountries?.map((prevCountry: Country) =>
            prevCountry.code === newCountry.code ? newCountry : prevCountry
          )
        );
      },
      onSettled: () => {
        console.log("onSetteled.....");
        queryClient.invalidateQueries({ queryKey: ["countries"] }); //refetch users after mutation, disabled for demo
      },
    });
  };

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<Country>) => {
    if (window.confirm("Are you sure you want to delete this country?")) {
      deleteCountry(row.original.code);
    }
  };

  // //DELETE hook (delete user in api)

  const useDeleteCountry = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (code: string) => {
        //send api update request here
        const response = dispatch(deleteCountryStart(code));
        return response;
      },

      //client side optimistic update

      onMutate: (code: string) => {
        queryClient.setQueryData(["countries"], (prevCountries: Country[]) =>
          prevCountries?.filter((country: Country) => country.code !== code)
        );
      },

      onSettled: () =>
        queryClient.invalidateQueries({ queryKey: ["countries"] }), //refetch countries after mutation, disabled for demo
    });
  };

  //CREATE hook (post new user to api)

  const useCreateCountry = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (country: Country) => {
        //send api update request here
        dispatch(createCountryStart(country));
      },

      //client side optimistic update
      onMutate: (newCountry: Country) => {
        queryClient.setQueryData(
          ["countries"],
          (prevCountries: Country[]) =>
            [
              ...prevCountries,
              {
                ...newCountry,
                // id: (Math.random() + 1).toString(36).substring(7),
              },
            ] as Country[]
        );
      },

      onSettled: () =>
        queryClient.invalidateQueries({ queryKey: ["countries"] }), //refetch users after mutation, disabled for demo
    });
  };

  // <------- CRUD Operations end ------>

  //call CREATE hook
  const { mutateAsync: createCountry, isPending: isCreatingCountry } =
    useCreateCountry();

  //call READ hook
  const {
    data: fetchedCountries = [],
    isError: isLoadingCountriesError,
    isFetching: isFetchingCountries,
    isLoading: isLoadingCountries,
  } = useGetCountries();

  //call UPDATE hook
  const { mutateAsync: updateCountry, isPending: isUpdatingCountry } =
    useUpdateCountry();

  // //call DELETE hook
  const { mutateAsync: deleteCountry, isPending: isDeletingCountry } =
    useDeleteCountry();

  // // //UPDATE action
  const handleSaveCountry: MRT_TableOptions<Country>["onEditingRowSave"] =
    async ({ values, table }) => {
      const newValidationErrors = validateCountry({ ...values });
      if (Object.values(newValidationErrors).some((error) => error)) {
        console.log("Errors......................", newValidationErrors);
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});

      await updateCountry(values);
      table.setEditingRow(null); //exit editing mode
    };

  // //CREATE action
  // const handleCreateCountry: MRT_TableOptions<Country>["onCreatingRowSave"] =
  //   async ({ values, table }) => {
  //     const newValidationErrors = validateCountry({ name });

  //     if (Object.values(newValidationErrors).some((error) => error)) {
  //       setValidationErrors(newValidationErrors);

  //       return;
  //     }

  //     setValidationErrors({});

  //     await createUser(values);

  //     table.setCreatingRow(null); //exit creating mode
  //   };

  // // put country in api
  // const useUpdateCountries = () => {
  //   const queryClient = useQueryClient();
  //   return useMutation({
  //     mutationFn: async (countries: Country[]) => {
  //       const response = dispatch(updateCountry(countries[0]));
  //       return response;
  //     },

  //     // client side optimistic update
  //     onMutate: (newCountries: Country[]) => {
  //       queryClient.setQueryData(["countries"], (prevCountries: Country[]) =>
  //         prevCountries.map((country: Country) => {
  //           const newCountry = newCountries.find((c) => c.code == country.code);
  //           return newCountry ? newCountry : country;
  //         })
  //       );
  //     },
  //     onSettled: () =>
  //       queryClient.invalidateQueries({ queryKey: ["countries"] }),
  //   });
  // };

  // // update hook
  // const { updateCountries, isPending, isUpdatingCountries } =
  //   useUpdateCountries;

  const table = useMaterialReactTable({
    columns,
    data: fetchedCountries,
    //...data,
    // displayColumnDefOptions: { "mrt-row-actions": { size: 100 } }, //change width of actions column to 300px
    // enableRowActions: true,
    // renderRowActions: ({ row }) => (
    //   <Box>
    //     <Button>Action 1</Button>
    //   </Box>
    // ),
    createDisplayMode: "row",
    editDisplayMode: "row",
    enableEditing: true,
    enableRowActions: true,
    positionActionsColumn: "last",
    onPaginationChange: setPage,
    //onPaginationChange: { ...setPagination },
    state: {
      //isSaving: isCreatingCountry,  || isUpdatingCountry || isDeletingCountry,
      //showAlertBanner: isLoadingCountriesError,
      showProgressBars: isFetchingCountries,
      isLoading: isLoadingCountries,
      //...page,
      ...page,
      // pagination: any,
    },
    //state: pagination,
    getRowId: (row) => row.code,
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableGrouping: true,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowSelection: true,
    muiToolbarAlertBannerProps: isLoadingCountriesError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    muiTableContainerProps: {
      sx: {
        minHeight: "500px",
      },
    },
    muiTableHeadCellProps: {
      sx: (theme) => ({
        fontSize: (theme.palette.background.paper = "1em"),
        // color: (theme.palette.text = "#fff"),
        backgroundColor: "#000",
        color: "#42a5f5",
      }),
    },
    // muiTableHeadRowProps: {
    //   // sx: {
    //   //   borderRadius: "3em",
    //   // },
    //   style: {
    //     // backgroundColor: "#000",

    //     border: "3px solid red",
    //   },
    // },

    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        backgroundColor: "#42a5f5",
        color: "#000",
        border: "4px inset #000",
      },
    }),

    muiTableBodyProps: {
      sx: (theme) => ({
        "& tr:nth-of-type(odd)": {
          backgroundColor: darken("#4B9CD3", 0),
        },
        "& tr:nth-of-type(even)": {
          // backgroundColor: darken("#7CB9E8", 0),
          backgroundColor: darken("#3E8EDE", 0),
        },
      }),
    },

    // mrtTheme: (theme) => ({
    //   baseBackgroundColor: "#45454",
    // }),

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
      // disabled: true,
      color: "secondary",
      rowsPerPageOptions: [5, 10, 20, 30],
      shape: "rounded",
      variant: "outlined",
    },

    onCreatingRowCancel: () => setValidationErrors({}),
    //onCreatingRowSave: handleCreateCountry,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveCountry,

    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Edit">
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),

    // renderTopToolbarCustomActions: ({ table }) => (
    //   <Button
    //     variant="contained"
    //     onClick={() => {
    //       table.setCreatingRow(true); //simplest way to open the create row modal with no default values
    //       //or you can pass in a row object to set default values with the `createRow` helper function
    //       // table.setCreatingRow(
    //       //   createRow(table, {
    //       //     //optionally pass in default values for the new row, useful for nested data or other complex scenarios
    //       //   }),
    //       // );
    //     }}
    //   >
    //     Create New Country
    //   </Button>
    // ),

    // renderBottomToolbarCustomActions: () => (
    //   <Box sx={{ display: "flex", gap: "1rem", alignItems: "center" }}>
    //     <Button
    //       color="success"
    //       variant="contained"
    //       onClick={handleSaveCountry}
    //       disabled={
    //         Object.keys(editedCountries).length === 0 ||
    //         Object.values(validationErrors).some((error) => !!error)
    //       }
    //     >
    //       {isUpdatingCountry ? <CircularProgress size={25} /> : "Save"}
    //     </Button>
    //     {Object.values(validationErrors).some((error) => !!error) && (
    //       <Typography color="error">Fix errors before submitting</Typography>
    //     )}
    //   </Box>
    // ),

    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          table.setCreatingRow(true);
        }}
      >
        New Country
      </Button>
    ),

    // state: {
    //   //  isLoading: isLoadingCountries,
    //   //  isSaving: isCreatingCountry,  || isUpdatingCountry || isDeletingCountry,
    //   // showAlertBanner: isLoadingCountriesError,
    //   // showProgressBars: isFetchingCountries,
    // },
  });

  return <MaterialReactTable table={table} />;
};

export default Table;

// https://www.dhiwise.com/post/how-to-implement-react-mui-file-upload-in-your-applications
// https://codesandbox.io/p/sandbox/material-ui-image-upload-component-9s8u0?file=%2Fsrc%2FImageUpload.js
