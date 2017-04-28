import { isNil } from 'lodash/lang';
import {
  QUEUE_UPDATED,
  PLAYING_CHANGED,
  RECEIVE_TERM,
  RECEIVE_RESULTS,
  TOGGLE_EXPANDED,
  VOTED_DOWN,
  VOTED_UP,
} from './actions';

const initialState = {
  expanded: true,
  votes: {}
};

function vote(state, videoId, direction) {
  let { votes } = state;

  const vote = votes[videoId];
  if (vote !== direction) {
    votes = Object.assign({}, votes, { [videoId]: direction });
  }

  return Object.assign({}, state, { votes });
}

function initialTime({ time }) {
  return isNil(time) ? 0 : Math.round(time / 1000);
}

function updatePlayingStartTime(videos) {
  let playingStartTime = 0;
  let playingUpdated = (new Date()).getTime();
  if (!isNil(videos.playingStartTime)) {
    const diff = playingUpdated - videos.playingUpdated;
    playingStartTime = Math.round(videos.playingStartTime + diff / 1000);
  }
  return { playingUpdated, playingStartTime };
}

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
          playing: action.playing && action.playing.video,
          playingStartTime: initialTime(action),
          playingUpdated: (new Date()).getTime(),
        });
    case TOGGLE_EXPANDED:
      return Object.assign({}, state, updatePlayingStartTime(state), {
        expanded: !state.expanded
      });
    case VOTED_DOWN:
      return vote(state, action.videoId, false);
    case VOTED_UP:
      return vote(state, action.videoId, true);
    default:
      return state;
  }
}

export {
  videos
}
