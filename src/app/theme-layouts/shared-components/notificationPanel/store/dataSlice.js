import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import axios from 'axios';

export const getNotifications = createAsyncThunk(
  'notificationPanel/getData',
  async () => {
    const response = await axios.get('/api/v1/notifications');
    const data = await response.data;

    return data;
  }
);

export const readNotifications = createAsyncThunk(
  'notificationPanel/readAll',
  async () => {
    const response = await axios.patch('/api/v1/notifications/readAll');
    const data = await response.data;

    return data;
  }
);

const notificationsAdapter = createEntityAdapter({});

const initialState = notificationsAdapter.upsertMany(
  notificationsAdapter.getInitialState(),
  []
);

export const {
  selectAll: selectNotifications,
  selectById: selectNotificationsById,
} = notificationsAdapter.getSelectors((state) => state.notificationPanel.data);

const dataSlice = createSlice({
  name: 'notificationPanel/data',
  initialState,
  reducers: {},
  extraReducers: {
    [getNotifications.fulfilled]: (state, action) => {
      notificationsAdapter.addMany(state, action.payload.notifications);
      state.hasNew = action.payload.hasNew;
    },
    [readNotifications.fulfilled]: (state, action) => {
      state.hasNew = false;
    },
  },
});

export const notificationHasNew = ({ notificationPanel }) => {
  return notificationPanel.data.hasNew;
};

export default dataSlice.reducer;
