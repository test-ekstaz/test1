import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { StateRepoSchema } from '../types/repoSchema.ts';
import axios from 'axios';

export const getUsersGithubRepo = createAsyncThunk(
  'repo/getUsersRepo',
  async ({ value, page, perPage }: { value: string; page: number; perPage: number }) => {
    const res = await axios.get(
      `https://api.github.com/search/repositories?q=${value}&page=${page}&per_page=${perPage}`,
    );
    return res.data;
  },
);

const initialState: StateRepoSchema = {
  isLoading: false,
  isError: false,
  page: 0,
  perPage: 10,
  value: '',
  repos: [],
};

export const githubRepoSlice = createSlice({
  name: 'repo',
  initialState,
  reducers: {
    clearData: (state) => {
      state.repos = [];
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setPerPage: (state, action) => {
      state.perPage = action.payload;
    },
    setValue: (state, action) => {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsersGithubRepo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsersGithubRepo.fulfilled, (state, action) => {
        state.repos.push(action.payload);
        state.isLoading = false;
      })
      .addCase(getUsersGithubRepo.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

// Action creators are generated for each case reducer function
export const { actions: githubRepoActions } = githubRepoSlice;
export const { reducer: githubRepoReducer } = githubRepoSlice;
