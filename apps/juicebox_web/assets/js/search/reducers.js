import {
  RECEIVE_TERM,
  RECEIVE_RESULTS,
} from './actions';

function search(state = {}, action) {
  switch (action.type) {
    case RECEIVE_TERM:
      return state;
    case RECEIVE_RESULTS:
      return Object.assign({}, state, { results: action.payload });
    default:
      return state;
  }
}

export {
  search
}
