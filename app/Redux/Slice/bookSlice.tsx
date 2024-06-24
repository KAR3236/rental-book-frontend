import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "book",
  initialState: {
    data: {},
    rentalData: [],
    bookData: [],
  },
  reducers: {
    viewUserProfile: (state, action) => {
      return { ...state, data: action.payload };
    },
    listOfRentalBooks: (state, action) => {
      return { ...state, rentalData: action.payload };
    },
    listOfBooks: (state, action) => {
      return { ...state, bookData: action.payload };
    },
  },
});

// Action creators are generated for each case reducer function
export const { viewUserProfile, listOfRentalBooks, listOfBooks } =
  userSlice.actions;

export default userSlice.reducer;
