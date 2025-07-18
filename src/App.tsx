import React, { useState } from "react";
// import logo from "./logo.svg";
import "./App.css";
import { Routes, Route, Outlet } from "react-router-dom";
// import { SidebarMenu } from "./navigation/nav";
// import Header from "./navigation/header.component";
import Home from "./home/home.component";
import MainMenu from "./navigation/main-menu.component";
import { Banks } from "./references/bank/bank.component";
import SignUpForm from "./user/sign-up/sign-up.form.component";
import SignInForm from "./user/sign-in/sign-in.form.component";
// import SignInForm, {
//   NavbarDefault,
// } from "./user/sign-in/sign-in.form.component";
//import Auth from "./auth/auth.component";
//import globalRouter from "./auth/globalRouter";
//import { useNavigate } from "react-router-dom";
import Country from "./references/country/country.component";
import Buyers from "./references/buyers/buyer.component";
import Suppliers from "./references/supplier/supplier.component";
import PortDestinations from "./references/port-destinations/port.destination.component";
import GarmentTypes from "./references/garment-type/garment-type.component";
import Currencies from "./references/currency/currency.component";
import Units from "./references/unit/unit.component";
import OrderConfirmationRoutine from "./order-management/order-confirmation-routine";
import CurrencyConversions from "./references/currency-conversion/currency-conversion.component";
import { CurrencyExchange } from "@mui/icons-material";
import CurrencyExchanges from "./references/currency-exchange/currency-exchange.component";
//import POs from "./po/po.component";

function App() {
  //const navigate = useNavigate();
  //globalRouter.navigate = navigate;
  // const [isOpen, setIsOpen] = useState(false);
  return (
    <Routes>
      <Route path="/" element={<MainMenu />}>
        <Route index path="/home" element={<Home />} />
        {/* <Route
          index
          path="sign-up"
          element={<SignUpForm />}
          // action={() => {}}
        /> */}
        <Route
          index
          path="sign-up"
          element={
            <SignUpForm setParentStatus={() => {}} />
            // <SignUpForm
            //   setParentStatus={({ setSignIn, setSignUp }: () => void) => {
            //     setSignIn(true);
            //     setSignUp(false);
            //   }}
            // />
          }
        />

        {/* <Route index path="sign-in1" element={<NavbarDefault />} /> */}
        <Route index path="sign-in" element={<SignInForm />} />
        {/* <Route index path="auth" element={<Auth />} /> */}
        <Route
          index
          path="bank"
          element={
            // <Bank
            //   pageNumber={0}
            //   pageSize={10}
            //   sortColumn={null}
            //   sortOrder={"asc"}
            //   filterColumn={null}
            //   filterQuery={null}
            // />
            // <Bank
            <Banks />
          }
        />
        <Route index path="country" element={<Country />} />
        <Route index path="buyers" element={<Buyers />} />
        <Route index path="supplier" element={<Suppliers />} />
        <Route index path="port-destination" element={<PortDestinations />} />
        <Route index path="garment-type" element={<GarmentTypes />} />
        <Route index path="currency" element={<Currencies />} />
        <Route index path="unit" element={<Units />} />
        <Route index path="po" element={<OrderConfirmationRoutine />} />
        <Route index path="currency-exchange" element={<CurrencyExchanges />} />
        <Route
          index
          path="currency-conversion"
          element={<CurrencyConversions />}
        />
        {/* <Route index path="po" element={<POs />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
