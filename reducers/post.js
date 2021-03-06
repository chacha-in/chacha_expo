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
} from '../actions/types';

const initialState = {
  posts: [],
  postDetail: null,
  page: 1,
  refreshing: false,
  loading: true,
  error: {}
};

export default (state = initialState, action) => {
  const { type, payload, page, refreshing } = action;

  switch (type) {
    case GET_POSTS:
    case GET_POSTS_BY_ID:
      return {
        ...state,
        posts: payload,
        page: page,
        loading: false,
        refreshing: false
      };
    case GET_POSTDETAIL:
      return {
        ...state,
        postDetail: payload,
        loading: false
      };
    case ADD_POST:
      return {
        ...state,
        posts: [payload, ...state.posts],
        loading: false,
        standby: {}
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== payload),
        loading: false
      };
    case DELETE_POSTDETAIL_COMMENT:
      return {
        ...state,
        postDetail: { ...state.postDetail, comments: payload },
        loading: false
      };
    case DELETE_POSTDETAIL_REDUCER:
      return {
        ...state,
        postDetail: { ...state.postDetail, comments: null }
      };
    case UPDATE_POSTDETAIL_COMMENT:
      return {
        ...state,

        postDetail: { ...state.postDetail, comments: payload }
      };
    case POST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    case UPDATE_LIKES:
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === payload.id ? { ...post, likes: payload.likes } : post
        ),
        loading: false
      };

    case ADD_COMMENT:
      return {
        // 기존 state를 가져오고
        ...state,
        // posts에 comments를 새로 배열로 상태업데이트를 한다. post._id가 payload값에서 전달받은 id와 같은 경우 post의 comments를 payload의 data값으로 업데이트 하고 아니면 그대로 둔다.
        posts: state.posts.map(post =>
          post._id === payload.id ? { ...post, comments: payload.data } : post
        ),
        loading: false
      };
    case REMOVE_COMMENT:
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === payload.postId
            ? {
                ...post,
                comments: post.comments.filter(
                  comment => comment._id !== payload.commentId
                )
              }
            : post
        ),
        loading: false
      };
    default:
      return state;
  }
};
