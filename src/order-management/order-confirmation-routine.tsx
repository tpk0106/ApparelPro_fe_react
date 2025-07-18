import {
  Box,
  Button,
  createTheme,
  FormControl,
  FormLabel,
  ListItem,
  MenuItem,
  TextField,
  Typography,
  useFormControl,
} from "@mui/material";

import { PurchaseOrder } from "../models/OrderManagement/PurchaseOrder";
import { ChangeEvent, useEffect, useState } from "react";
import Menu from "../navigation/menu.component";
import { SelectAllBuyers } from "../sagaStore/buyer/buyer.selector";
import { PaginationData, POParameters } from "../defs/defs";
import { MRT_PaginationState } from "material-react-table";
import { Buyer } from "../models/references/Buyer";
import { Unit } from "../models/references/Unit";
import { Currency } from "../models/references/Currency";
import { Basis } from "../models/references/Basis";
import { SelectAllCurrencies } from "../sagaStore/currency/currency.selector";
import { SelectAllUnits } from "../sagaStore/unit/unit.selector";
import { z } from "zod";

import { useGetPurchaseOrder } from "../data/custom.hooks.ts/apparel-pro.repository.hooks";

import {
  SelectOrder,
  selectOrder,
} from "../sagaStore/order-confirmation/order.selector";
import { useDispatch, useSelector } from "react-redux";

import { BUYERS_ACTION_TYPES } from "../sagaStore/buyer/buyer.types";

import {
  createOrderStart,
  loadOrderStart,
} from "../sagaStore/order-confirmation/order.action";

import { useQuery } from "@tanstack/react-query";

import { SelectAllBasises } from "../sagaStore/basis/basis.selector";

//import { DatePicker } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PickerValidDate } from "@mui/x-date-pickers/models";

// date-fns
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import type {} from "@mui/x-date-pickers/themeAugmentation";
import dayjs, { Dayjs } from "dayjs";

const OrderConfirmationRoutine = () => {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [basises, setBasises] = useState<Basis[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);

  const buyerAndOrderParams: POParameters = {
    buyerCode: 0,
    order: "",
  };

  // const dbOrder = useSelector(selectOrder);
  // console.log("FINAL DbOrder--------------------->", dbOrder);
  //console.log("FINAL PO--------------------->", selector.order);
  // const response = {
  //   buyer: dbOrder?.buyer,
  //   buyerCode: dbOrder?.buyerCode,
  //   order: dbOrder?.order,
  //   description: dbOrder?.description,
  //   quotaQuantity: dbOrder?.quotaQuantity,
  //   totalQuantity: dbOrder?.totalQuantity,
  //   currencyCode: dbOrder?.currencyCode,
  //   countryCode: dbOrder?.countryCode,
  //   unitCode: dbOrder?.unitCode,
  //   season: dbOrder?.season,
  //   basisCode: dbOrder?.basisCode,
  //   orderDate: dbOrder?.orderDate,
  //   garmentType: dbOrder?.garmentType,
  //   garmentTypeName: dbOrder?.garmentTypeName,
  //   basisValue: dbOrder?.basisValue,
  // };
  // const defaultOrderConfrmationForm: PurchaseOrder = po1
  //   ? { ...response }
  //   : {
  //       buyerCode: 0,
  //       buyer: "",
  //       order: "1017-18",
  //       description: "",
  //       quotaQuantity: 0,
  //       totalQuantity: 0,
  //       currencyCode: "",
  //       countryCode: "",
  //       unitCode: "",
  //       season: "",
  //       basisCode: "",
  //       orderDate: new Date(),
  //       garmentType: "",
  //       garmentTypeName: "",
  //       basisValue: 0,
  //     };

  const theme = createTheme({
    components: {
      MuiDatePicker: {
        defaultProps: {
          displayWeekNumber: true,
        },
      },
      // MuiDateRangeCalendar: {
      //   styleOverrides: {
      //     root: {
      //       backgroundColor: "#f0f0f0",
      //     },
      //   },
      // },
    },
  });

  //const customDateString = new Date().toLocaleDateString();
  const customDateString: PickerValidDate = new Date();
  console.log("customDateString ", customDateString.toLocaleDateString());
  function parseCustomDate(dateString: string): Date | null {
    const parts = dateString.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts.map(Number);
      return new Date(year, month - 1, day); // Month is 0-indexed
    }
    return null;
  }

  const customDate = parseCustomDate(customDateString.toLocaleDateString());

  // let mydate: PickerValidDate;
  // console.log(customDate);

  const defaultOrderConfrmationForm: PurchaseOrder = {
    buyerCode: 0,
    buyer: "",
    order: "",
    description: "",
    quotaQuantity: 0,
    totalQuantity: 0,
    currencyCode: "",
    countryCode: "",
    unitCode: "",
    season: "",
    basisCode: "",
    orderDate: new Date(),
    garmentType: "",
    garmentTypeName: "",
    basisValue: 0,
  };

  const [orderConfirmationForm, setOrderConfirmationForm] = useState(
    defaultOrderConfrmationForm
  );

  const paginate: PaginationData = {
    pageNumber: 0,
    pageSize: 0,
    sortColumn: null,
    sortOrder: null,
    filterColumn: null,
    filterQuery: null,
  };

  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 999,
  });

  const buyersList = SelectAllBuyers(paginate, pagination);
  const currencyList = SelectAllCurrencies(paginate);
  const unitsList = SelectAllUnits(paginate, pagination);
  const basisesList = SelectAllBasises(paginate, pagination);

  const [errors, setErrors] = useState<orderConfirmationFormErrors>();

  const menu = [
    {
      menu: "Styles",
      label: "Styles",
      routerLink: "Styles",
    },
    {
      menu: "Shipments/Part Shipments.",
      label: "Shipments/Part Shipments.",
      routerLink: "shipments",
    },
    {
      menu: "Colour/Size Breakdown....",
      label: "Colour/Size Breakdown....",
      routerLink: "color-size-breakdown",
    },
  ];

  const {
    buyerCode,
    order,
    description,
    quotaQuantity,
    totalQuantity,
    currencyCode,
    unitCode,
    season,
    basisCode,
    orderDate,
    buyer,
    countryCode,
    garmentType,
    garmentTypeName,
    basisValue,
  }: PurchaseOrder = orderConfirmationForm;

  const orderConfirmationFormSchema = z.object({
    buyerCode: z.coerce.number().min(1, "buyer code required,"),
    // buyer: z.coerce.string().min(1, "Buyer Required"),
    order: z.coerce.string().min(5, "Order required."),
    description: z.coerce.string(),
    quotaQuantity: z.coerce.number(),
    totalQuantity: z.coerce.number(),
    orderDate: z.coerce.date(),
    garmentType: z.coerce.string(),
    currencyCode: z.coerce.string().nullable(),
    countryCode: z.coerce.string().nullable(),
    unitCode: z.coerce.string().nullable(),
    basisCode: z.coerce.string().nullable(),
    season: z.coerce.string().nullable(),
    garmentTypeName: z.coerce.string().nullable(),
    basisValue: z.coerce.number(),
  });

  type orderConfirmationFormData = z.infer<typeof orderConfirmationFormSchema>;
  type orderConfirmationFormErrors = Partial<
    Record<keyof orderConfirmationFormData, string[]>
  >;

  //console.log("PO--------------------->", data);
  // const LoadBuyer = () => {
  //   useGetPurchaseOrder({ buyer, order });
  // };

  //const selector = SelectOrder({ ...po1 });
  // const dbOrder = useSelector(selectOrder);
  // console.log("FINAL DbOrder--------------------->", dbOrder);
  // //console.log("FINAL PO--------------------->", selector.order);
  // const response = {
  //   buyer: dbOrder?.buyer,
  //   buyerCode: dbOrder?.buyerCode,
  //   order: dbOrder?.order,
  //   description: dbOrder?.description,
  //   quotaQuantity: dbOrder?.quotaQuantity,
  //   totalQuantity: dbOrder?.totalQuantity,
  //   currencyCode: dbOrder?.currencyCode,
  //   countryCode: dbOrder?.countryCode,
  //   unitCode: dbOrder?.unitCode,
  //   season: dbOrder?.season,
  //   basisCode: dbOrder?.basisCode,
  //   orderDate: dbOrder?.orderDate,
  //   garmentType: dbOrder?.garmentType,
  //   garmentTypeName: dbOrder?.garmentTypeName,
  //   basisValue: dbOrder?.basisValue,
  // };
  // //setOrderConfirmationForm(dbOrder);
  // Object.keys(response).forEach((key) => {
  //   //setOrderConfirmationForm()
  //   console.log("KEY : ", key);
  //   //  Object.values[key]
  //   const vals: any[] = [];
  //   Object.values(response).forEach((val) => {
  //     console.log("Values : ", val);
  //     vals.push(val);
  //   });
  // });

  // const FetchData = async () => {
  //   useGetPurchaseOrder(po1);
  //   const dbOrder = useSelector(selectOrder);
  // setOrderConfirmationForm({ ...defaultOrderConfrmationForm, season: "XXXXX" });
  // };

  // const dispatch = useDispatch();
  // const FetchData = async () => {
  // dispatch(loadOrderStart({ ...po1 }));

  // const fetchPos = useQuery<PurchaseOrder[]>({
  //   queryKey: ["po"],
  //   queryFn: async () => {
  //     // const response = dispatch(loadOrderStart(po1));
  //     dispatch(loadOrderStart(po1));
  //     //  console.log("dispatch", response.payload);
  //     //return response.payload;
  //     //return Promise.resolve(response);
  //     return [];
  //   },
  //   refetchOnWindowFocus: false,
  // });

  //  const { data } = fetchPos;

  // console.log("DATA :", data);
  // useGetPurchaseOrder(po1);
  const dbOrder = useSelector(selectOrder);
  console.log("select :", dbOrder);

  //return qryResult.data;
  //  const data = SelectOrder({ ...po1 });
  //const { payload } = dispatch(loadOrderSucess({ ...po1 }));
  //  console.log("XX------------", data);
  //  useGetPurchaseOrder(po1);
  //const dbOrder = useSelector(selectOrder);
  // setOrderConfirmationForm({ ...defaultOrderConfrmationForm, ...dbOrder });
  // };

  // function LoadData() {
  //   dispatch(loadOrderStart(po1));
  //   const dc = useSelector(selectOrder);
  //   console.log("CCCCCCCCCC", dc);
  // }
  //const data = FetchData();
  //  console.log("data----", data);
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("USE EFFECT");
    // LoadData();
    // https://www.qovery.com/blog/why-we-replaced-redux-by-react-query/
    dispatch(loadOrderStart(buyerAndOrderParams));

    // console.log("use effect");
    // setOrderConfirmationForm({
    //   ...defaultOrderConfrmationForm,
    //   season: "yyyyyyy",
    // });
    // setOrderConfirmationForm({
    //   ...defaultOrderConfrmationForm,
    //   season: "XXXXX",
    // });
    // const FetchData = async () => {
    //   // dispatch(loadOrderStart({ ...po1 }));

    //   return useQuery<PurchaseOrder[]>({
    //     queryKey: ["po"],
    //     queryFn: async () => {
    //       const response = dispatch(loadOrderStart(po1));
    //       console.log("dispatch", response.payload);
    //       return response.payload;
    //       //return Promise.resolve(response);
    //     },
    //     refetchOnWindowFocus: false,
    //   });
    //   //console.log("", qryResult.data);
    //   //return qryResult.data;
    //   //  const data = SelectOrder({ ...po1 });
    //   //const { payload } = dispatch(loadOrderSucess({ ...po1 }));
    //   //  console.log("XX------------", data);
    //   //  useGetPurchaseOrder(po1);
    //   //const dbOrder = useSelector(selectOrder);
    //   // setOrderConfirmationForm({ ...defaultOrderConfrmationForm, ...dbOrder });
    // };

    // const data = FetchData();
    // console.log("data----", data);
    // FetchData().then((r) => {
    //   const x = r.data;
    //   console.log("Response : ", x);
    // });
    // FetchData().then((r) => {
    //   console.log("Response : ", r);
    // });
    // console.log("RES : ", r);

    // Object.keys(defaultOrderConfrmationForm).forEach(key =>{
    //   setOrderConfirmationForm(defaultOrderConfrmationForm[key]);
    // })
    //const selector = SelectOrder({ buyer, order });
    //const PO = SelectOrder({ buyer, order });
    // if (selector) {

    // console.log("res--------------------->", res);
    // setOrderConfirmationForm({
    //   ...orderConfirmationForm,
    //   [name]: response.basisCode,
    // });
    // console.log("after setting vals to form --------------------->", dbOrder);
    console.log(
      "after setting vals to form --------------------->",
      orderConfirmationForm
    );

    //  setOrderConfirmationForm({ ...defaultOrderConfrmationForm, ...response });

    // orderConfirmationFormData = {...dbOrder}

    setBuyers(buyersList);
    setCurrencies(currencyList);
    setUnits(unitsList);
    setBasises(basisesList);
  }, [
    buyersList,
    currencyList,
    unitsList,
    basisesList,
    dispatch,
    buyerAndOrderParams.buyerCode,
    buyerAndOrderParams.order,
  ]);

  const validateForm = (
    data: orderConfirmationFormData
  ): orderConfirmationFormErrors => {
    try {
      orderConfirmationFormSchema.parse(data);
      return {};
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.flatten().fieldErrors;
      }
      return {};
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setOrderConfirmationForm({ ...orderConfirmationForm, [name]: value });
    const newErrors = validateForm(orderConfirmationForm);
    setErrors(newErrors);
  };

  // https://stackoverflow.com/questions/78468351/why-i-am-getting-mui-x-datetimepicker-typeerror-value-isvalid-is-not-a-function

  const handleDateChange1 = (date: dayjs.Dayjs, name: string) => {
    // const formattedDate = dayjs(date).format("dd/MM/YYYY");
    console.log("date change......", date);
    console.log("date change......", name);
    setOrderConfirmationForm({ ...orderConfirmationForm, [name]: date });
  };

  //const handleDateChange = (date: dayjs.Dayjs, dateType: any) => {
  const handleDateChange = (date: Dayjs, name: string) => {
    // const formattedDate = dayjs(date).format("dd/MM/YYYY");
    console.log("date change date......", date.format("DD/MM/YYYYY"));
    //const formattedDate = date.format("DD/MM/YYYYY");
    console.log("date change......", name);
    setOrderConfirmationForm({
      ...orderConfirmationForm,
      [name]: date.toDate(),
      //[name]: dayjs(date.format("DD/MM/YYYY")),
    });
  };

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    const newErrors = validateForm(orderConfirmationForm);
    setErrors(newErrors);

    if (Object.keys(newErrors).length !== 0) {
      return;
    }
    if (Object.keys(newErrors).length === 0) {
      // Form is valid, proceed with submission
    }

    buyerAndOrderParams.buyerCode = orderConfirmationForm.buyerCode;
    buyerAndOrderParams.order = orderConfirmationForm.order;

    try {
      console.log("Submit Value :", { ...orderConfirmationForm });
      const form = orderConfirmationForm;

      // redux
      console.log("dispatchng form....", { ...form });
      dispatch(createOrderStart({ ...form }));
      //
    } catch (error: unknown) {
      console.log("Error !", error);
      console.log("Error !", typeof error);
      //console.error(error.response.data);
      //   setLoginError((error as ZodError).response.data);
      // alert(error.response.data);
    }
  };

  return (
    <>
      <div className="border-2 border-gray-900 max-h-[700px] min-h-[650px]">
        <h1 className="text-center tracking-[0.4em] font-semibold p-4">
          Order Confirmation Routine
        </h1>

        <div className="flex justify-around">
          <Box className="flex flex-col justify-center drop-shadow-md m-2 border-2 border-gray- p-3 w-full  min-h-[640px] border1-4 border1-blue-600">
            {/* <Typography variant="h4" color="blue-gray" className="text-center">
              Order Confirmation Routine
            </Typography> */}

            <div className="flex w-full justify-around border-3 border-red-400">
              <Box
                component="form"
                className="flex mx-auto border-4 border-violet-500 w-full mb-2"
              >
                <FormControl
                  sx={{
                    m: 0,
                    borderRadius: "4px",
                    // border: "4px solid red",
                    marginLeft: "auto",
                    marginRight: "auto",
                    width: "80%",
                  }}
                  variant="outlined"
                >
                  <div className="flex sm:flex-col md:flex-row w-full p-0 m-0 border-3 border-green-400">
                    <div className="flex sm:flex-col md:flex-col w-full p-0 m-0 border1-4 border1-yellow-300 mx-5">
                      <div className="flex sm:flex-col md:flex-col w-full p-0 m-0">
                        <FormControl>
                          <TextField
                            select
                            error
                            name="buyerCode"
                            label="Buyer"
                            margin="normal"
                            size="small"
                            defaultValue={buyerCode}
                            onChange={handleChange}
                            variant="outlined"
                            type="text"
                          >
                            {buyers?.map((buyer) => {
                              return (
                                <MenuItem value={buyer.buyerCode}>
                                  <div className="flex justify-between w-full my-auto">
                                    {buyer.name}
                                  </div>
                                </MenuItem>
                              );
                            })}
                          </TextField>
                          {errors?.buyerCode && (
                            <div className="flex w-full py-0 text-red-600 justify-start ml-0 text-sm z-10">
                              {errors?.buyerCode}
                            </div>
                          )}
                        </FormControl>
                      </div>
                      <div className="flex sm:flex-col md:flex-col w-full p-0 m-0 drop-shadow-lg">
                        <FormControl>
                          <TextField
                            name="description"
                            label="Description"
                            margin="normal"
                            size="small"
                            defaultValue={description}
                            onChange={handleChange}
                          />
                        </FormControl>
                      </div>
                      <div className="flex sm:flex-col md:flex-col w-full p-0 m-0 drop-shadow-lg">
                        <FormControl>
                          <TextField
                            select
                            error
                            name="unitCode"
                            label="Unit"
                            margin="normal"
                            size="small"
                            defaultValue={unitCode}
                            onChange={handleChange}
                            variant="outlined"
                            type="text"
                          >
                            {units?.map((unit) => {
                              return (
                                <MenuItem value={unit.code}>
                                  <div className="flex justify-between w-full my-auto">
                                    {unit.description}
                                  </div>
                                </MenuItem>
                              );
                            })}
                          </TextField>
                        </FormControl>
                      </div>
                      <div className="flex sm:flex-col md:flex-col w-full p-0 m-0 drop-shadow-lg">
                        <FormControl>
                          <TextField
                            select
                            error
                            name="currencyCode"
                            label="Currency"
                            margin="normal"
                            size="small"
                            defaultValue={currencyCode}
                            onChange={handleChange}
                            variant="outlined"
                            type="text"
                          >
                            {currencies?.map((currency) => {
                              return (
                                <MenuItem value={currency.code}>
                                  <div className="flex justify-between w-full my-auto">
                                    {currency.name}
                                  </div>
                                </MenuItem>
                              );
                            })}
                          </TextField>
                        </FormControl>
                      </div>
                      <div className="flex sm:flex-col md:flex-col w-full p-0 m-0 drop-shadow-lg">
                        <FormControl>
                          <TextField
                            select
                            error
                            name="basisCode"
                            label="Basis"
                            margin="normal"
                            size="small"
                            defaultValue={basisCode}
                            onChange={handleChange}
                            variant="outlined"
                            type="text"
                          >
                            {basises?.map((basis) => {
                              return (
                                <MenuItem value={basis.code}>
                                  <div className="flex justify-between w-full my-auto">
                                    {basis.description}
                                  </div>
                                </MenuItem>
                              );
                            })}
                          </TextField>
                        </FormControl>
                      </div>
                    </div>

                    <div className="flex sm:flex-col md:flex-col w-full p-0 m-0 border1-4 border1-red-600 mx-5">
                      <div className="flex sm:flex-col md:flex-col w-full p-0 m-0">
                        <FormControl>
                          <TextField
                            name="order"
                            label="Order"
                            margin="normal"
                            size="small"
                            defaultValue={order}
                            onChange={handleChange}
                          ></TextField>
                          {errors?.order && (
                            <div className="flex w-full py-0 text-red-600 justify-start ml-0 text-sm z-10">
                              {errors.order}
                            </div>
                          )}
                        </FormControl>
                      </div>
                      <div className="flex sm:flex-col md:flex-col w-full p-0 m-0">
                        <FormControl>
                          <TextField
                            name="quotaQuantity"
                            label="Quota Quantity"
                            margin="normal"
                            size="small"
                            defaultValue={quotaQuantity}
                            onChange={handleChange}
                          />
                        </FormControl>
                      </div>
                      <div className="flex sm:flex-col md:flex-col w-full p-0 m-0">
                        <FormControl>
                          <TextField
                            name="totalQuantity"
                            label="Total Quantity"
                            margin="normal"
                            size="small"
                            defaultValue={totalQuantity}
                            onChange={handleChange}
                          />
                        </FormControl>
                      </div>
                      <div className="flex sm:flex-col md:flex-col w-full p-0 m-0">
                        <FormControl>
                          <TextField
                            name="season"
                            label="Season"
                            margin="normal"
                            size="small"
                            defaultValue={season}
                            onChange={handleChange}
                          />
                        </FormControl>
                      </div>
                      {/* <div className="flex sm:flex-col md:flex-col w-full p-0 m-0">
                        <FormControl>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label="Order Date"
                              name="orderDate"
                              value={dayjs(orderDate)}
                              onChange={(newValue) =>
                                handleDateChange(dayjs(newValue), orderDate)
                              }
                              // maxDate={new Date()}
                            />
                          </LocalizationProvider>
                        </FormControl>
                      </div> */}
                      <div className="flex sm:flex-col md:flex-col w-full p-0 m-0">
                        <FormControl>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label="Order Date"
                              name="orderDate"
                              format="DD/MM/YYYY"
                              value={dayjs(orderDate)}
                              onChange={(newValue) =>
                                handleDateChange(dayjs(newValue), "orderDate")
                              }
                              //maxDate={dayjs(new Date())}
                            />
                          </LocalizationProvider>
                        </FormControl>
                      </div>
                      {/* <div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            label="Order Date"
                            name="orderDate"
                            value={orderDate}
                            handleDateChange(dayjs(newValue), orderDate)
                          />
                        </LocalizationProvider>
                      </div> */}
                      {/* <div className="flex sm:flex-col md:flex-col w-full p-0 m-0">
                        <FormControl>
                          <TextField
                            name="orderDate"
                            label="Order Date"
                            margin="normal"
                            size="small"
                            defaultValue={orderDate}
                            onChange={handleChange}
                          />
                        </FormControl>
                      </div> */}
                    </div>
                  </div>
                </FormControl>
              </Box>
            </div>

            <div>
              <Typography color="gray" className="mt-6 text-center font-normal">
                <Button
                  variant="contained"
                  style={{ width: "100%", margin: "0px" }}
                  onClick={(event: MouseEvent<HTMLButtonElement>) =>
                    handleSubmit(event)
                  }
                  href="#"
                >
                  Save Order
                </Button>
              </Typography>
            </div>

            {/* <div>
              {menu.map((m) => {
                return (
                  <ListItem
                    className="m-0 h-[2em] rounded-md my-1"
                    key={m.label}
                  >
                    <div className="w-[20%] text-[14.5px]">
                      <Menu
                        subMenus={null}
                        label={m.menu}
                        icon=""
                        routerLink={m.routerLink}
                      />
                    </div>
                  </ListItem>
                );
              })}
            </div> */}
          </Box>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmationRoutine;

// tanstack usequery with redux saga in react

// // component.js
// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useQuery } from '@tanstack/react-query';

//  // Define actions
// const FETCH_DATA_REQUEST = 'FETCH_DATA_REQUEST';
// const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS';
// const FETCH_DATA_FAILURE = 'FETCH_DATA_FAILURE';

// const fetchData = async () => {
//     const response = await fetch('your-api-endpoint');
//     if (!response.ok) {
//         throw new Error('Network response was not ok');
//     }
//     return response.json();
// };

// const MyComponent = () => {
//   const dispatch = useDispatch();
//   const { data, loading, error } = useSelector((state) => state.data);

//   const {
//     isLoading,
//     isError,
//     data: queryData,
//     refetch
//   } = useQuery('myData', fetchData);

//   useEffect(() => {
//     dispatch({ type: FETCH_DATA_REQUEST });
//   }, [dispatch]);

//   if (isLoading) {
//     return <p>Loading...</p>;
//   }

//   if (isError) {
//     return <p>Error: {error.message}</p>;
//   }

//   return (
//     <div>
//       <h1>Data from useQuery</h1>
//       {queryData && <pre>{JSON.stringify(queryData, null, 2)}</pre>}

//       <h1>Data from Redux Saga</h1>
//       {loading && <p>Loading data...</p>}
//       {error && <p>Error: {error}</p>}
//       {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
//       <button onClick={refetch}>Refetch Data</button>
//     </div>
//   );
// };

// export default MyComponent;

// https://medium.com/@charuwaka/supercharge-your-react-forms-with-react-hook-form-zod-and-mui-a-powerful-trio-47b653e7dce0

// import React, { useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';

// function MyForm({ initialValues }) {
//   const { register, handleSubmit, setValue } = useForm({
//     defaultValues: initialValues,
//   });

//   useEffect(() => {
//     if (initialValues) {
//       Object.keys(initialValues).forEach((key) => {
//         setValue(key, initialValues[key]);
//       });
//     }
//   }, [initialValues, setValue]);

//   const onSubmit = (data) => {
//     console.log(data);
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <TextField
//         label="Name"
//         {...register('name')}
//         margin="normal"
//         fullWidth
//       />
//       <TextField
//         label="Email"
//         {...register('email')}
//         margin="normal"
//         fullWidth
//       />
//       <TextField
//         label="Age"
//         type="number"
//         {...register('age')}
//         margin="normal"
//         fullWidth
//       />
//       <Button type="submit" variant="contained" color="primary">
//         Submit
//       </Button>
//     </form>
//   );
// }

//export default MyForm;
