import { setAlert } from './alert';
import {
  GET_POSTS,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
  ADD_POST,
  GET_POSTDETAIL,
  ADD_COMMENT,
  REMOVE_COMMENT,
  ADD_POST_STANDBY,
  GET_POSTS_BY_ID,
  UPDATE_POSTDETAIL_COMMENT,
  DELETE_POSTDETAIL_COMMENT,
  DELETE_POSTDETAIL_REDUCER
} from './types';

// Get posts
export const getPosts = (page, posts) => async dispatch => {
  if (page === undefined) {
    page = 1;
  }

  try {
    const res = await fetch(`https://blochaid.io/api/posts/page/${page}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json'
      }
    });

    const resJson = await res.json();

    if (resJson === null || resJson.length === 0) {
      console.log('데이터 없다');
      return;
    }

    if (page > 1) {
      const newPosts = [...posts, ...resJson];
      dispatch({
        type: GET_POSTS,
        payload: newPosts,
        page: page + 1
      });
    } else {
      console.log('첫번째 데이터', resJson);
      dispatch({
        type: GET_POSTS,
        payload: resJson,
        page: page + 1
      });
    }
  } catch (error) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get posts by id
export const getPostById = _id => async dispatch => {
  try {
    console.log(_id);
    const res = await axios.get(`/api/posts/${_id}`);

    dispatch({
      type: GET_POSTS_BY_ID,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Like it
export const likeIt = id => async dispatch => {
  try {
    console.log(id);
    const res = await axios.put(`/api/posts/like/${id}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data }
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Add like
export const addLike = id => async dispatch => {
  try {
    const res = await axios.put(`/api/posts/like/${id}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data }
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Remove like
export const removeLike = id => async dispatch => {
  try {
    const res = await axios.put(`/api/posts/unlike/${id}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: { id, likes: res.data }
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete post
export const deletePost = id => async dispatch => {
  try {
    await axios.delete(`/api/posts/${id}`);

    dispatch({
      type: DELETE_POST,
      payload: id
    });

    dispatch(setAlert('Post Removed', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Add post
export const addPost = formData => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.post('/api/posts', formData, config);

    dispatch({
      type: ADD_POST,
      payload: res.data
    });

    dispatch(setAlert('Post Created', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Get post
export const _getPostDetail = post => async dispatch => {
  console.log('액션들어옴');
  try {
    dispatch({
      type: GET_POSTDETAIL,
      payload: post[0]
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Add comment
export const addComment = (postId, formData) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.post(
      `/api/posts/comment/${postId}`,
      formData,
      config
    );
    // data에 새로 저장된 코멘트를 포함한 전체 코멘트를 가져와서 저장한다. post._id값은 id로 지정하여 넘겨준다.
    dispatch({
      type: ADD_COMMENT,
      payload: { data: res.data, id: postId }
    });

    dispatch(setAlert('Comment Added', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Delete comment
export const deleteComment = (postId, commentId) => async dispatch => {
  console.log(postId, commentId);
  try {
    await axios.delete(`/api/posts/comment/${postId}/${commentId}`);

    console.log('여기까지는 오나미');

    dispatch({
      type: REMOVE_COMMENT,
      payload: { postId: postId, commentId: commentId }
    });

    dispatch(setAlert('Comment Removed', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Update post by id
export const updatePostComment = comments => async dispatch => {
  dispatch({ type: UPDATE_POSTDETAIL_COMMENT, payload: comments });
};

// Delete post by id
export const deletePostComment = postDetail => async dispatch => {
  dispatch({ type: DELETE_POSTDETAIL_COMMENT, payload: postDetail });
};
