import {
  QUEUE_UPDATED,
  PLAYING_CHANGED,
  RECEIVE_TERM,
  RECEIVE_RESULTS,
  TOGGLE_EXPANDED,
} from './actions';

const initialState = {
  expanded: true
};

function videos(state = initialState, action) {
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
          playingStartTime: action.time || 0,
          playingUpdated: (new Date()).getTime()
        });
    case TOGGLE_EXPANDED:
      return Object.assign({}, state, { expanded: !state.expanded });
    default:
      return state;
  }
}

export {
  videos
}
