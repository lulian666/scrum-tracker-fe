import {
  createAsyncThunk,
  createEntityAdapter,
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
      `/api/v1/boards/${board.id}/cards/${card.data.id}`,
      CommentModel(comment)
    );

    const data = await response.data.comment;
    return data;
  }
);

const commentsAdapter = createEntityAdapter({});

export const { selectAll: selectComments, selectById: selectCommentById } =
  commentsAdapter.getSelectors((state) => state.scrumboardApp.comments);

const commentsSlice = createSlice({
  name: 'scrumboardApp/comments',
  initialState: commentsAdapter.getInitialState({}),
  reducers: {
    resetComments: (state, action) => {},
  },
  extraReducers: {
    [newComment.fulfilled]: commentsAdapter.addOne,
  },
});

export const { resetComments } = commentsSlice.actions;

export default commentsSlice.reducer;
