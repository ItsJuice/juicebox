import { QUEUE_UPDATED } from './actions';
import { cloneDeep } from 'lodash';

function videos(state = [], action = {}) {
  switch (action.type) {
    case QUEUE_UPDATED:
      return cloneDeep(action.videos);
    default:
      return state;
  }
}

export {
  videos
}