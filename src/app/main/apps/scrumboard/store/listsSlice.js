import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import ListModel from '../model/ListModel';

/**
 * Get Board Lists
 */
export const getLists = createAsyncThunk('scrumboardApp/lists/get', async (boardId) => {
  const response = await axios.get(`/api/v1/boards/${boardId}/lists`);

  const data = await response.data.lists;

  return data;
});

/**
 * Create List
 */
export const newList = createAsyncThunk(
  'scrumboardApp/lists/new',
  async (list, { dispatch, getState }) => {
    const { board } = getState().scrumboardApp;

    const response = await axios.post(`/api/v1/boards/${board.id}/lists`, ListModel(list));

    const data = await response.data.list;
    console.log('response.data.boards', data)
    return data;
  }
);

/**
 * Update list
 */
export const updateList = createAsyncThunk(
  'scrumboardApp/lists/update',
  async ({ id, newData }, { dispatch, getState }) => {
    const { board } = getState().scrumboardApp;

    const response = await axios.patch(`/api/v1/boards/${board.id}/lists/${id}`, newData);

    const data = await response.data.list;

    return data;
  }
);

/**
 * Remove list
 */
export const removeList = createAsyncThunk(
  'scrumboardApp/lists/remove',
  async (id, { dispatch, getState }) => {
    const { board } = getState().scrumboardApp;

    const response = await axios.delete(`/api/v1/boards/${board.id}/lists/${id}`);

    await response.data;

    return id;
  }
);
const listsAdapter = createEntityAdapter({});

export const { selectAll: selectLists, selectById: selectListById } = listsAdapter.getSelectors(
  (state) => state.scrumboardApp.lists
);

const listsSlice = createSlice({
  name: 'scrumboardApp/lists',
  initialState: listsAdapter.getInitialState({}),
  reducers: {
    resetLists: (state, action) => {},
  },
  extraReducers: {
    [getLists.fulfilled]: listsAdapter.setAll,
    [updateList.fulfilled]: listsAdapter.setOne,
    [removeList.fulfilled]: listsAdapter.removeOne,
    [newList.fulfilled]: listsAdapter.addOne,
  },
});

export const { resetLists } = listsSlice.actions;

export default listsSlice.reducer;
