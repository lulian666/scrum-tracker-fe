import {
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';
import axios from 'axios';
import CommentModel from '../model/CommentModel';

/**
 * Create Comment
 */
export const newComment = createAsyncThunk(
  'scrumboardApp/comments/new',
  async (comment, { dispatch, getState }) => {
    const { board, card } = getState().scrumboardApp;

    const response = await axios.post(
      `/api/v1/boards/${board.id}/cards/${card.data.id}/comments`,
      CommentModel(comment)
    );

    const data = await response.data.comment;
    return data;
  }
);


const commentsSlice = createSlice({
  name: 'scrumboardApp/comments',
  initialState: null,
  reducers: {
    resetComments: (state, action) => {},
  }
});

export const { resetComments } = commentsSlice.actions;

export default commentsSlice.reducer;
