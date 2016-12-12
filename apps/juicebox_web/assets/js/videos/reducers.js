import { 
  QUEUE_UPDATED,
  PLAYING_CHANGED,
} from './actions';

function videos(state = {}, action) {
  switch (action.type) {
    case QUEUE_UPDATED:
      return Object.assign({}, state,
                {
                  queue: action.videos,
                }
              );
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