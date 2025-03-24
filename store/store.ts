import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice"; 
import favoriteReducer from "./favoriteSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer, 
    favorites: favoriteReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
