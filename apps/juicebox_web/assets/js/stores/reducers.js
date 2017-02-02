import { combineReducers } from 'redux';
import { routerStateReducer as router } from 'redux-router';
import { videos } from '../videos/reducers'
import { reactions } from '../reactions/reducers'
import { search } from '../search/reducers'

const rootReducer = combineReducers({
  router,
  videos,
  reactions,
  search,
});

export default rootReducer;
