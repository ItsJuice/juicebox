import { NEW_REACTION, NEXT_REACTION } from './actions';
import { cloneDeep } from 'lodash';

function reactions(state = [], action = {}) {
  switch (action.type) {
    case NEW_REACTION:
      return [action.video, ...state];
    case NEXT_REACTION:
      return state.slice(1);
    default:
      return state;
  }
}

export {
  reactions
}
