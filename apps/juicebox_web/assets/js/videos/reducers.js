import { 
  QUEUE_UPDATED,
  PLAYING_CHANGED,
} from './actions';

function videos(state = {}, action) {
  switch (action.type) {
    case QUEUE_UPDATED:
      return {
        ...state,
        queue: action.videos,
      };
    case PLAYING_CHANGED:
      return {
        ...state,
        playing: action.playing.video,
        playingStartTime: action.time,
      };
    default:
      return state;
  }
}

export {
  videos
}