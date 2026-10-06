import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "@/context/slices/cartSlice";

// Fresh store per client render; avoids leaking cart state across requests
export const makeStore = () =>
  configureStore({
    reducer: {
      cart: cartReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
