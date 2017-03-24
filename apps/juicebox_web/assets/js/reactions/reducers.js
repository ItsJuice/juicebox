import { NEW_REACTION } from './actions';
import { omit } from 'lodash';

function reactions(state = {}, action = {}) {
  switch (action.type) {
    case NEW_REACTION:
      return Object.assign({},
         omit(state, action.user_id),
         action.video && {
           [action.user_id]: {
             video: action.video,
             frame: action.frame,
           }
         });
    default:
      return state;
  }
}

export {
  reactions
}
