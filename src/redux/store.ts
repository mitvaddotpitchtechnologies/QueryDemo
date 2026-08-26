//TanStack Query પોતાનો cache QueryClient માં રાખે છે,
//  જ્યારે RTK Query પોતાનો cache Redux storeમાં રાખે છે.

import {
  configureStore,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

import {
  RTKUserApi,
} from '../api/RTKUserApi';

type AuthState = {
  isLoggedIn: boolean;
  email: string | null;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    email: null,
  } as AuthState,
  reducers: {
    // LOGIN
    signIn: (
      state,
      action: PayloadAction<string>,
    ) => {
      state.isLoggedIn = true;
      state.email = action.payload;
    },
    signOut: state => {
      state.isLoggedIn = false;
      state.email = null;
    },
  },
});

export const {
  signIn,
  signOut,
} = authSlice.actions;

export const store = configureStore({
  reducer: {
    // Normal Redux state
    auth: authSlice.reducer,

    // RTK Query cache
    [RTKUserApi.reducerPath]:
      RTKUserApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(
      RTKUserApi.middleware,
    ),

});

export type RootState =
  ReturnType<typeof store.getState>;

export type AppDispatch =
  typeof store.dispatch;