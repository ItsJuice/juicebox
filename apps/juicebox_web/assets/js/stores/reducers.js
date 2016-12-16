import { combineReducers } from 'redux';
import { routerStateReducer as router } from 'redux-router';
import { videos } from '../videos/reducers'
import { search } from '../search/reducers'

const rootReducer = combineReducers({
  router,
  videos,
  search,
});

export default rootReducer;
