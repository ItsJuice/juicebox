import { combineReducers } from 'redux';
import { routerStateReducer as router } from 'redux-router';
import { videos } from '../videos/reducers'
import { reactions } from '../reactions/reducers'

const rootReducer = combineReducers({
  router,
  videos,
  reactions
});

export default rootReducer;
