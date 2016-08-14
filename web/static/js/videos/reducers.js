import { VIDEO_ADDED } from './actions';
import { cloneDeep } from 'lodash';

function videos(state = [], action = {}) {
  switch (action.type) {
    case VIDEO_ADDED:
      const videos = cloneDeep(state);
      videos.push(action.video);
      return videos;
    default:
      return state;
  }
}

export {
  videos
}