import { combineReducers } from 'redux';
import { routerStateReducer as router } from 'redux-router';
import { videos } from '../videos/reducers'

const rootReducer = combineReducers({
  router,
  videos
});

export default rootReducer;
