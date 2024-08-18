import { configureStore } from '@reduxjs/toolkit';
import { StateSchema } from './StateSchema';
import { githubRepoReducer } from '../../../../entities/Search';

export const store = configureStore<StateSchema>({
  reducer: {
    repositories: githubRepoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
