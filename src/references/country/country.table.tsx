import { useState, useMemo, useEffect, ChangeEvent } from "react";
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
  MRT_PaginationState,
  MRT_ColumnFiltersState,
  MRT_SortingState,
  isCellEditable,
  MRT_Cell,
  MRT_EditCellTextField,
  getMRT_RowSelectionHandler,
  getIsRowSelected,
  MRT_TableBodyCell,
} from "material-react-table";

import {
  Box,
  Button,
  IconButton,
  // Typography,
  darken,
  // CircularProgress,
  Tooltip,
  createTheme,
  Input,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { Country } from "../../models/references/Country";
import {
  isLoading,
  selectAllCountries,
} from "../../sagaStore/country/country.selector";
import { PaginationData } from "../../defs/defs";

import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import ImageUpload from "./image-upload.component";

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

// declare module "@mui/material/styles" {
//   interface Palette {
//     custom: Palette["primary"];
//   }

//   interface PaletteOptions {
//     custom?: PaletteOptions["primary"];
//   }
// }

// declare module "@mui/material/Button" {
//   interface PaginationPropsColorOverrides {
//     custom: true;
//   }
// }

// const tableTheme = createTheme({
//   palette: {
//     primary: {
//       light: "#42a5f5",
//       main: "#42a5f5",
//       dark: "#42a5f5",
//       // darker: "#42a5f5",
//     },
//   },
// });

// const theme = createTheme({
//   palette: {
//     ochre: {
//       main: "#E3D026",
//       light: "#E9DB5D",
//       dark: "#A29415",
//       contrastText: "#242105",
//     },
//   },
// });

// const tableTyporaphyTheme = createTheme({

//   components: {
//     MuiTypography: {
//       PaginationStyleOverrides: {
//         root: {
//           fontSize: "14px",
//           // variants: "h6",
//           color: "#42a5f5",
//           fontWeight: 600,
//           textAlign: "center",
//           margin: "auto",
//           padding: "auto",
//           ":hover": { color: "#fff", fontWeight: "500" },
//         },
//       },
//     },
//   },
// });

const CountryTable = () => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string | undefined>
  >({});

  const [editedCountries, setEditedCountries] = useState<
    Record<string, Country>
  >({});

  const [countryData, setCountryData] = useState<Country[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const paginate: PaginationData = {
    pageNumber: 0,
    pageSize: 10,
    sortColumn: null,
    sortOrder: null,
    filterColumn: null,
    filterQuery: null,
  };

  //const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [selectedState, setSelectedState] = useState<Record<string, boolean>>(
    {}
  );
  const [createNewCountry, setCreateNewCountry] = useState(false);
  const [editingCell, setEditingCell] = useState(false);
  const [countryFlag, setCountryFlag] = useState<any>();

  // paging state
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = useState<MRT_SortingState>([
    { id: "name", desc: false },
  ]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  //

  const dispatch = useDispatch();
  const countryPaginationAPIModel = useSelector(selectAllCountries);
  // const paginationAPIResult = useSelector(
  //   (state: any) => state.country.paginationAPIResult
  // );

  const columns = useMemo<MRT_ColumnDef<Country>[]>(
    () => [
      {
        accessorKey: "id",
        enableEditing: false,
        enableColumnFilterModes: false,
        enableColumnFilter: false, // hide filter
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
        // enableEditing: editingCell,
        // enableEditing: (row) => row.original.code == false,
        enableEditing: (row) => row.original.code?.length == 0,
        header: "Code",
        size: 80,
        muiTableBodyCellProps: ({ cell }) => ({
          onClick: () => {
            // if (createNewCountry) {
            //   console.log("code editing enabled");
            //   setEditingCell(true);
            // }

            console.log("çell clicked.", cell.getValue(), cell.id);
          },
        }),

        // muiTableBodyCellEditTextFieldProps: ({ cell, row }) => ({
        //   required: true,
        //   variant: "contained",
        //   // disabled: editingCell,
        //   sx: {
        //     backgroundColor: "yellow",
        //     // enableEditing:  row.original.code == false,
        //     //or add some other CSS here based on cell or row conditions
        //   },
        // }),

        enableColumnActions: true,
        Cell: ({ renderedCellValue }) => (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              height: "30px",
              // backgroundColor: "#fff",
              borderRadius: "3px",
              //  border: "1px solid #000",
            }}
          >
            <span>{renderedCellValue}</span>
          </Box>
        ),
        columnFilterModeOptions: ["contains"],
      },
      {
        id: "name",
        header: "Name",
        accessorKey: "name",
        enableEditing: true,
        enableColumnActions: true,
        size: 200,
        columnFilterModeOptions: ["contains"],
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
        header: "Flag",
        size: 100,
        enableEditing: (row) => row.original.flag === null,
        // enableColumnFilterModes: false,
        enableColumnFilter: false,
        Cell: ({ renderedCellValue, row }) =>
          row.original.flag.length > 0 ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <span>
                <img
                  src={imageDataUrl(renderedCellValue)}
                  className="w-8 h-[20px] my-auto mt-0 rounded-sm"
                />
              </span>
            </Box>
          ) : (
            <ImageUpload
              setParentState={(flg) => {
                console.log("returned flag value------>>>>: ", flg);
                setCountryFlag(flg);
                //console.log("setCountryFlag target ------>>>>: ", countryFlag);
              }}
            />
          ),

        // Edit: ({ row, cell }) => {
        //   row.original.name = "zzzzzzz";
        //   return <ImageUpload />;
        // },
        // muiEditTextFieldProps: ({ cell, row }) => ({
        //   onblur: () => {
        //     console.log("edit......", cell);
        //     console.log("edit......", row);
        //   },
        // }),

        // muiEditTextFieldProps: ({ cell, row }) => ({
        //   required: true,
        //   onBllur: () => {
        //     // row.original.flag = setFlag();
        //     console.log("cell clicked..................", cell);
        //   },
        // }),

        // muiEditTextFieldProps: {
        //   required: true,
        // },
      },
    ],
    []
  );

  // {
  //   isLoading && <div>Loading.........</div>;
  // }

  useEffect(() => {
    if (countryPaginationAPIModel?.items) {
      setCountryData(countryPaginationAPIModel.items);
      setRowCount(countryPaginationAPIModel.totalItems);
    }
  }, [countryPaginationAPIModel?.items, countryPaginationAPIModel?.totalItems]);

  // <------- CRUD Operations  ------>

  // const { data } = useQuery<Country[]>({
  //   queryKey: [
  //     "countries",
  //     pagination.pageSize,
  //     pagination.pageIndex,
  //     columnFilters,
  //     sorting,
  //   ],

  //   queryFn: async () => {
  //     //send api request here

  //     const queryClient = new QueryClient();
  //     queryClient.resetQueries({
  //       queryKey: [
  //         "countries",
  //         pagination.pageSize,
  //         pagination.pageIndex,
  //         columnFilters,
  //         sorting,
  //       ],
  //     });

  //     console.log("PAGINATION : ", pagination.pageIndex);
  //     const sortBy = sorting[0].id;
  //     const filterBy = columnFilters.length === 0 ? null : columnFilters[0].id;
  //     const filterValue =
  //       columnFilters.length === 0 ? null : (columnFilters[0].value as string);

  //     console.log("final pagination", {
  //       ...paginate,
  //       pageNumber: pagination.pageIndex,
  //       sortColumn: sortBy,
  //       filterColumn: filterBy,
  //       filterQuery: filterValue,
  //       ...pagination,
  //     });

  //     dispatch(
  //       loadAllCountriesStart({
  //         ...paginate,
  //         pageNumber: pagination.pageIndex,
  //         sortColumn: sortBy,
  //         filterColumn: filterBy ?? null,
  //         filterQuery: filterValue ?? null,
  //         ...pagination,
  //       })
  //     );

  //     //setInterval(() => {}, 100000);

  //     console.log("RETURNED Total :", countryPaginationAPIModel.totalItems);
  //     setRowCount(countryPaginationAPIModel.totalItems);
  //     console.log("RETURNED COUNTRIES :", countryPaginationAPIModel.items);
  //     //setCountryData(countryPaginationAPIModel.items);
  //     //  setTimeout(() => {}, 2000);
  //     return countryPaginationAPIModel.items;

  //     //return [];
  //   },
  //   refetchOnWindowFocus: "always",
  // });

  //READ hook (get users from api)

  function useGetCountries() {
    return useQuery<Country[]>({
      queryKey: [
        "countries",
        pagination.pageSize,
        pagination.pageIndex,
        columnFilters,
        sorting,
      ],

      queryFn: async () => {
        //send api request here

        // console.log("PAGINATION : ", pagination.pageIndex);
        const sortBy = sorting[0].id;
        const filterBy =
          columnFilters.length === 0 ? null : columnFilters[0].id;
        const filterValue =
          columnFilters.length === 0
            ? null
            : (columnFilters[0].value as string);

        // console.log("final pagination", {
        //   ...paginate,
        //   pageNumber: pagination.pageIndex,
        //   sortColumn: sortBy,
        //   filterColumn: filterBy,
        //   filterQuery: filterValue,
        //   ...pagination,
        // });

        await dispatch(
          loadAllCountriesStart({
            ...paginate,
            pageNumber: pagination.pageIndex,
            sortColumn: sortBy,
            filterColumn: filterBy ?? null,
            filterQuery: filterValue ?? null,
            ...pagination,
          })
        );

        // setRowCount(countryPaginationAPIModel.totalItems);
        //console.log("RETURNED COUNTRIES :", countryPaginationAPIModel.items);
        // setCountryData(countryPaginationAPIModel.items);

        // https://stackoverflow.com/questions/70425384/redux-toolkit-returns-the-previous-state-when-you-make-a-request-for-data-how-d

        //return countryPaginationAPIModel.items;
        return [];
      },
      // staleTime: 3000,
      // refetchInterval: 3000,
      refetchOnWindowFocus: false,
      //   refetchOnWindowFocus: "always",
    });
  }

  //call READ hook

  const {
    // data, // data is COMMENTED so countryData is used instead data here.

    isError: isLoadingCountriesError,
    isFetching: isFetchingCountries,
    isLoading: isLoadingCountries,
  } = useGetCountries();

  //CREATE hook (post new user to api)

  const useCreateCountry = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (country: Country) => {
        //send api update request here

        const res = dispatch(createCountryStart({ ...country }));
        return res.payload;
      },

      //client side optimistic update
      onMutate: (newCountry: Country) => {
        console.log("onMutate.....CREATE", newCountry);
        // dispatch(loadAllCountriesStart());
        queryClient.setQueryData(
          ["countries"],
          (prevCountries: Country[]) =>
            [
              ...prevCountries,
              {
                ...newCountry,
              },
            ] as Country[]
        );
      },

      onSuccess: (data) => {
        console.log("success:", data);
      },

      onError: (error) => {
        console.log("error ......", error);
      },

      onSettled: () => {
        console.log("onSetteled.....CREATE");
        queryClient.invalidateQueries({ queryKey: ["countries"] });
        console.log("onSetteled ending invalidate.....CREATE");
      },
    });
  };

  //call CREATE hook
  const { mutateAsync: createCountry, isPending: isCreatingCountry } =
    useCreateCountry();

  //UPDATE hook (put user in api)

  const useUpdateCountry = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (country: Country) => {
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
        // queryClient.refetchQueries();
        queryClient.invalidateQueries({ queryKey: ["countries"] }); //refetch users after mutation, disabled for demo
      },
    });
  };

  //call UPDATE hook
  const { mutateAsync: updateCountry, isPending: isUpdatingCountry } =
    useUpdateCountry();

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

  //DELETE action
  const openDeleteConfirmModal = (row: MRT_Row<Country>) => {
    if (window.confirm("Are you sure you want to delete this country?")) {
      deleteCountry(row.original.code);
    }
  };

  // call DELETE hook
  const { mutateAsync: deleteCountry, isPending: isDeletingCountry } =
    useDeleteCountry();

  //CREATE action

  const handleCreateCountry: MRT_TableOptions<Country>["onCreatingRowSave"] =
    async ({ values, table }) => {
      console.log("Flag Data =======>: ", countryFlag);
      values = {
        ...values,
        id: 0,
        flag: countryFlag,
      };
      console.log("values....", values);
      const newValidationErrors = validateCountry(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        console.log("error........", newValidationErrors);
        return;
      }
      setValidationErrors({});
      await createCountry(values);
      table.setCreatingRow(null); //exit creating mode
    };

  // UPDATE action
  const handleSaveCountry: MRT_TableOptions<Country>["onEditingRowSave"] =
    async ({ values, table }) => {
      const newValidationErrors = validateCountry({ ...values });
      if (Object.values(newValidationErrors).some((error) => error)) {
        // console.log("Errors......................", newValidationErrors);
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});

      await updateCountry(values);
      table.setEditingRow(null); //exit editing mode
    };

  // <------- CRUD Operations end ------>

  //const onChangeCreateRow: MRT_Row<Country>["onCreatingRowChange"] = ({
  // const onChangeCreateRow: MRT_Row<Country> = ({
  //   row
  // }) => {
  //   console.log("row create .......", row);
  // };

  // const handleCreateRow = (row: MRT_Row<Country>, cell: MRT_Cell<Country>) => {
  //   //  setEditingCell(true);
  //   //console.log("cell", cell?.getValue(), cell.id);
  //   setNewCountry(true);
  //   console.log("creating row......", row.getAllCells());

  //   // const code = row.getAllCells()[2].getContext().cell;
  //   console.log("cell : ", cell.getValue);
  //   // console.log("cell : ", cell);
  //   //  cell.enableEditing = false;
  //   // console.log("table......");
  // };

  const table = useMaterialReactTable({
    columns,
    // data: data!,
    data: countryData,
    //data: fetchedCountries,

    // behaviour
    createDisplayMode: "row",
    editDisplayMode: "row",
    enableEditing: true,
    enableRowActions: true,
    positionActionsColumn: "last",
    //

    // pagination
    manualPagination: true,
    onPaginationChange: setPagination,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    paginationDisplayMode: "pages",

    // onRowSelectionChange: setSelectedState,

    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [5, 10, 20, 30],
      shape: "rounded",
      variant: "outlined",
      // sx: {
      //   // bgcolor: "primary.light",
      //   color: "#42a5f5",
      //   // boxShadow: " 0 0 50px #42a5f5",
      //   borderRadius: "3px",
      //   border: "2px solid #42a5f5",
      //   padding: "2px",
      // },
    },
    //

    // remove search/filter (only sort available)
    // enableToolbarInternalActions: false,

    // positionGlobalFilter: "left",

    enableMultiRowSelection: false,
    state: {
      isSaving: isCreatingCountry || isUpdatingCountry || isDeletingCountry,
      showAlertBanner: isLoadingCountriesError,
      showProgressBars: isFetchingCountries,
      isLoading: isLoadingCountries,
      pagination,
      rowSelection: selectedState,
    },
    getRowId: (row) => row.code,
    rowCount,
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    //enableGrouping: true,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowSelection: false,

    muiToolbarAlertBannerProps: isLoadingCountriesError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,

    muiTableContainerProps: {
      sx: {
        minHeight: "500px",
        // boxShadow: " 0 0 50px #ccc",
        boxShadow: "0 -5px 3px -3px black, 0 5px 3px -3px ",
        // border: "3px solid red",
      },
    },

    // Cell styling
    muiTableHeadCellProps: {
      sx: (theme) => ({
        fontSize: (theme.palette.background.paper = "1em"),
        // color: (theme.palette.text = "#fff"),
        // backgroundColor: "#000",
        color: "#42a5f5",
        boxShadow: "0 -5px 3px -3px black, 0 5px 3px -3px ",
        border: "3px #f8f8",
      }),
    },

    // muiTableBodyCellProps: {
    //   sx: (theme) => ({
    //     border: "4px solid red",
    //     //backgroundColor: "#fff",
    //   }),
    // },

    //

    // muiTableBodyCellProps: ({ cell }) => ({
    //    // console.log("cell clicked.....", cell),
    //   sx: () => ({
    //    // boxShadow: column.getIsPinned() ? "0 0 0 2px #42a5f5" : "",
    //   }),
    // }),

    // Row stryling
    muiTableBodyRowProps: ({ row, staticRowIndex, table }) => ({
      sx: {
        backgroundColor: "#f5f",
        cursor: "pointer",
        color: "#f8f8",
        border: "4px solid red",
      },
      onClick: () => {
        console.log("selected...", row.id);
        //console.log("row selection state", rowSelection);
        console.log("row selection state", selectedState);
        // setRowSelection((prev) => ({
        //   ...prev,
        //   [row.id]: !prev[row.id],
        // }));
        setSelectedState((prev) => ({
          ...prev,
          [row.id]: !prev[row.id],
        }));
      },
      //selected: rowSelection[row.id],
      selected: selectedState[row.id],
      color: "#f9f9",
      //  backgroundColor: "#f9f9",

      // sx: {
      //   cursor: "pointer",
      // },
      // onClick: (event: ChangeEvent<HTMLInputElement>) =>
      //   getMRT_RowSelectionHandler({ row, staticRowIndex, table })(event),
      // style: {
      //   curosr: "pointer",
      //   userselect: "none",
      // },
    }),

    onRowSelectionChange: setSelectedState,

    //

    // search textbox
    muiSearchTextFieldProps: {
      label: "Search country code/country name",
      placeholder: "type to Search text",
      variant: "outlined",
    },

    // Body styling
    muiTableBodyProps: {
      sx: (theme) => ({
        "& tr:nth-of-type(odd)": {
          //backgroundColor: darken("#87CEFA", 0), // light sky blue
          // backgroundColor: "#87CEFA", // light sky blue
          backgroundColor: darken("#4B9CD3", 0),
        },
        "& tr:nth-of-type(even)": {
          backgroundColor: darken("#7CB9E8", 0),

          // backgroundColor: "#7CB9E8", // aero blue
        },
      }),
    },

    // // Body styling
    // muiTableBodyProps: {
    //   sx: (theme) => ({
    //     "& tr:nth-of-type(odd)": {
    //       //backgroundColor: darken("#87CEFA", 0), // light sky blue
    //       // backgroundColor: "#87CEFA", // light sky blue
    //       backgroundColor: darken("#4B9CD3", 0),
    //     },
    //     "& tr:nth-of-type(even)": {
    //       backgroundColor: darken("#7CB9E8", 0),

    //       // backgroundColor: "#7CB9E8", // aero blue
    //     },
    //   }),
    // },

    // toolbar styling
    muiTopToolbarProps: {
      sx: (theme) => ({
        backgroundColor: "rgb(96 165 250)",
        boxShadow: "0px 0px 20px rgba(0,0,0,.5)",
      }),
    },

    // caption

    // muiTableProps: {
    //   sx: {
    //     captionSide: "top",
    //   },
    // },

    // renderCaption: () => {
    //   return <div>Countries...........................................</div>;
    // },

    // muiTableFooterProps: {
    //   sx: () => ({
    //     backgroundColor: "rgb(96 165 250)",
    //     boxShadow: "0px 0px 20px rgba(0,0,0,.5)",
    //     boder: "3px solid red",
    //   }),
    // },

    muiTableFooterRowProps: {
      sx: () => ({
        backgroundColor: "rgb(96 165 250)",
        boxShadow: "0px 0px 20px rgba(0,0,0,.5)",
        boder: "5px solid red",
      }),
    },

    //
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

    positionToolbarAlertBanner: "bottom",

    // onEditingRowChange: () => {
    //   console.log("row change");
    // },
    onCreatingRowChange: (row) => {
      console.log("create row change..", row);
      setSelectedState((prev) => ({
        ...prev,
        //[row.id]: !prev[row.id],
      }));
      //      setRowSelection()
      // toggleSelected(true);
    },
    // onEditingCellChange: (value) => {
    //   console.log("cell change", value);
    // },
    //  onCreatingRowChange: handleCreateRow,
    // onCreatingRowChange: onChangeCreateRow,
    //  onCreatingRow:()=>{},
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateCountry,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveCountry,

    renderRowActions: ({ row }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title="Edit">
          {/* <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton> */}
          <IconButton onClick={() => table.setEditingRow(row)}>
            <ModeEditOutlinedIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteForeverOutlinedIcon className="flex w-full justify-start h-5 w1-5 border1-4 border1-yellow-300" />
          </IconButton>
          {/* <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
            <DeleteIcon />
          </IconButton> */}
        </Tooltip>
      </Box>
    ),

    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        onClick={() => {
          // table.setEditingCell();
          table.setCreatingRow(true);
          // setCreateNewCountry(true);
        }}
      >
        New Country
      </Button>
    ),
  });

  {
    isFetchingCountries && <div>Loading.........</div>;
  }

  return <MaterialReactTable table={table} />;
};

export default CountryTable;

// https://www.dhiwise.com/post/how-to-implement-react-mui-file-upload-in-your-applications
// https://codesandbox.io/p/sandbox/material-ui-image-upload-component-9s8u0?file=%2Fsrc%2FImageUpload.js
