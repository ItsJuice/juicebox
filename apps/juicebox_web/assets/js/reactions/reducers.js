import { NEW_REACTION, NEXT_REACTION } from './actions';
import { cloneDeep, omit } from 'lodash';

function reactions(state = {}, action = {}) {
  switch (action.type) {
    case NEW_REACTION:
      return Object.assign({},
         omit(state, action.user_id),
         action.video && {
           [action.user_id]: action.video
         });
    default:
      return state;
  }
}

export {
  reactions
}
