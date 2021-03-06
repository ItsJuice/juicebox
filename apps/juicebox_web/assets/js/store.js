import { createStore as originalCreateStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import history from './utils/browser-history';
import { createSocket } from './sockets';

function devMiddleware(middleware, args = []) {
  if (__DEV__) {
    return middleware.apply(this, args);
  }

  return () => (next) => (action) => next(action);
}

const enhancedCreateStore = compose(
  applyMiddleware(
    thunk,
    createSocket(),
    routerMiddleware(history),
    devMiddleware(createLogger)
  )
)(originalCreateStore);

export default enhancedCreateStore;
