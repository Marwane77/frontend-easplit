import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  value: {
    token: null,
    firstName: null,
    email: null,
    events: [],
    balance: null,
    transactions: [],
  },
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.value.token = action.payload.token;
      state.value.email = action.payload.email;
      state.value.firstName = action.payload.firstName;
      state.value.balance = action.payload.balance;
      state.value.transactions = action.payload.transactions;
    },
    logout: (state) => {
      state.value.token = null;
      state.value.email = null;
      state.value.firstName = null;
      state.value.balance = null; //bien réinitialiser au logout pour éviter les bugs et conflits (et bien reset à zero le champs)
      state.value.transactions = null;
    },
    addEvent: (state, action) => {
      state.value.events.unshift(action.payload);
    },
    // removeEvent: (state, action) => {
    //   state.value.events = state.value.events.filter(
    //     (e) => e.name !== action.payload
    //   );
    // },
    loadEvents: (state, action) => {
      state.value.events = action.payload;
    },
    addBalance: (state, action) => {
      //fonction reload / refund
      state.value.balance += action.payload;
      // state.value.transactions.unshift(action.payload.transaction);
    }, // test beranger
    downBalance: (state, action) => {
      //fonction paiement
      state.value.balance -= action.payload;
    }, // test beranger
  },
});

export const {
  login,
  logout,
  addEvent,
  removeEvent,
  loadEvents,
  addBalance,
  downBalance,
} = userSlice.actions;
export default userSlice.reducer;
