import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { videos } from './videos/reducers'
import { reactions } from './reactions/reducers'
import { search } from './search/reducers'

const rootReducer = combineReducers({
  routing,
  videos,
  reactions,
  search,
});

export default rootReducer;
