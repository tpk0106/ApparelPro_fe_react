//import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
//import { applyMiddleware } from "@reduxjs/toolkit";
import { legacy_createStore as createStore, applyMiddleware } from "redux";
import { rootSaga } from "./root-saga";
import { rootReducer } from "./rootReducer";
import { compose } from "@reduxjs/toolkit";
import logger from "redux-logger";

import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/es/storage";
//import { INITIAL_STATE } from "./user/user.selector";
// import {
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
// } from "redux-persist";
//import { persistStore, persistReducer } from "redux-persist";
//import storage from "redux-persist";
//import persistReducer from "redux-persist";

// create persist store

// this declaration is done in index.d.ts instead of here
declare global {
  interface Window {
    //__REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

// create the saga middleware

const persistConfig = {
  key: "root",
  storage,
  // whitelist: [""],
};

const sagaMiddleware = createSagaMiddleware();

// rootReducer includes all combined reducers
const persistedReducer = persistReducer(persistConfig, rootReducer);

//const middleWares = [logger]; // react default logger mechanism

// react default logger

// const middleWares = Middleware<string>[] = [
//   process.env.NODE_ENV !== "production" && logger,
//   sagaMiddleware,
// ].filter(Boolean);

// Add another redux middleware as follows:
const beforeEmitter =
  () => (next: (arg0: any) => void) => (action: { type: string }) => {
    const beforeAction = {
      ...action,
      type: `BEFORE_${action.type}`,
    };
    next(beforeAction); // 'beforeEmitter' emit a 'before-action' for every action
    return next(action);
  };

const middleWares: (typeof logger | typeof sagaMiddleware)[] = [
  process.env.NODE_ENV !== "production" ? logger : undefined,
  sagaMiddleware,
].filter(Boolean);

const composeEnhancer =
  compose(
    process.env.NODE_ENV !== "production" &&
      Window &&
      Window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
  ) || compose;

// const composeEnhancer = ((window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
// (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ trace: true, traceLimit: 25 }))
// || compose

// compose(
//   applyMiddleware(sagaMiddleware),
//   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
// );

const composedEnhancers = composeEnhancer(
  // applyMiddleware(beforeEmitter, ...middleWares)
  applyMiddleware(...middleWares)
);

export const store = createStore(
  rootReducer,
  //persistedReducer,
  undefined,
  composedEnhancers
);
//export const store = createStore(rootReducer, undefined, composedEnhancers);

// mount it on the Store
// const initialState = {};
// export const store1 = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//       // serializableCheck: {
//       //   ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
//       // },
//     }).concat(sagaMiddleware),
//   //.concat(composedEnhancers),
//   devTools: process.env.NODE_ENV !== "production",
//   // preloadedState: initialState,
// });

// then run the saga
sagaMiddleware.run(rootSaga);
export const persistor = persistStore(store);

// render the application
