import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/es/integration/react";
import {
  ReactQueryDevtools,
  // ReactQueryDevtoolsPanel,
} from "@tanstack/react-query-devtools";

import App from "./App.tsx";
import "./index.css";

import { ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material";

import { persistor, store } from "./sagaStore/sagaStore.ts";

import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

//const [isOpen, setIsOpen] = useState(false);
// const setOpen = () =>{
//   const [isOpen, setIsOpen] = useState(false);
// }

declare module "@mui/material/styles" {
  interface Palette {
    custom: Palette["primary"];
  }

  interface PaletteOptions {
    custom?: PaletteOptions["primary"];
  }
}

declare module "@mui/material/Button" {
  interface PaginationPropsColorOverrides {
    custom: true;
  }
}

declare module "@mui/material/styles" {
  interface Palette {
    salmon: Palette["primary"];
  }

  interface PaletteOptions {
    salmon?: PaletteOptions["primary"];
  }
}

// Update the Button's color options to include a salmon option
declare module "@mui/material/Button" {
  interface PaginationPropsColorOverrides {
    salmon: true;
  }
}

let theme = createTheme({
  // Theme customization goes here as usual, including tonalOffset and/or
  // contrastThreshold as the augmentColor() function relies on these
});

theme = createTheme(theme, {
  // Custom colors created with augmentColor go here
  palette: {
    salmon: theme.palette.augmentColor({
      color: {
        main: "#FF5733",
      },
      name: "salmon",
    }),
  },
});

const blueTheme = createTheme({
  palette: {
    primary: {
      main: "#42a5f5",
      light: "#808080",
      // light: will be calculated from palette.primary.main,
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: "#42a5f5",
      light: "#F5EBFF",
      // dark: will be calculated from palette.secondary.main,
      contrastText: "#47008F",
    },
  },
});

const yellowTheme = createTheme({
  palette: {
    primary: {
      main: "#E3D026",
      light: "#E9DB5D",
      dark: "#A29415",
      contrastText: "#242105",
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        {/* <PersistGate loading={null} persistor={persistor}> */}
        <BrowserRouter>
          <ThemeProvider theme={blueTheme}>
            <App />
          </ThemeProvider>
        </BrowserRouter>
        {/* </PersistGate> */}
      </Provider>
      <ReactQueryDevtools initialIsOpen={true} />
      {/* <button onClick={() => setIsOpen(!isOpen)}>{`${
        isOpen ? "Close" : "Open"
      } the devtools panel`}</button>
      {isOpen && <ReactQueryDevtoolsPanel onClose={() => setIsOpen(false)} />} */}
    </QueryClientProvider>
  </React.StrictMode>
);
