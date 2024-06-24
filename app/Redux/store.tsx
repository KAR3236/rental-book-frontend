import { configureStore } from "@reduxjs/toolkit";
import loaderSlice from "./Slice/loaderSlice";
import bookSlice from "./Slice/bookSlice";

export default configureStore({
  reducer: {
    loader: loaderSlice,
    book: bookSlice,
  },
});
