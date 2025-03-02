import { configureStore } from '@reduxjs/toolkit';
import domainsReducer from './domainsSlice';
import themeReducer from './themeSlice';

export const store = configureStore({
  reducer: {
    domains: domainsReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;