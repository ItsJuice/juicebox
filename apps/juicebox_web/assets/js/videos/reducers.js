import {
  QUEUE_UPDATED,
  PLAYING_CHANGED,
  RECEIVE_TERM,
  RECEIVE_RESULTS,
} from './actions';

function videos(state = {}, action) {
  switch (action.type) {
    case RECEIVE_TERM:
      return state;
    case RECEIVE_RESULTS:
      return Object.assign({}, state, { results: action.payload });
    case QUEUE_UPDATED:
      return Object.assign({}, state, { queue: action.videos });
    case PLAYING_CHANGED:
      return Object.assign({}, state,
        {
          playing: action.playing.video,
          playingStartTime: action.time,
        });
    default:
      return state;
  }
}

export {
  videos
}
