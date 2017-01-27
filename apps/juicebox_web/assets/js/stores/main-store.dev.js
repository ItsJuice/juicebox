import { createStore, applyMiddleware, compose } from 'redux';
import { reduxReactRouter } from 'redux-router';
import DevTools from '../containers/dev-tools';
import createHistory from 'history/lib/createBrowserHistory';
import routes from '../routes';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { createSocket, connectToChannel, subscribeToStream } from '../sockets';
import rootReducer from './reducers';

const finalCreateStore = compose(
  applyMiddleware(
    thunk
  ),
  applyMiddleware(createSocket()),
  reduxReactRouter({
    routes,
    createHistory
  }),
  applyMiddleware(createLogger()),
  DevTools.instrument()
)(createStore);

export default function configureStore(initialState) {
  const store = finalCreateStore(
    rootReducer,
    initialState
  );

  subscribeToStream({action: connectToChannel, store});

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept(
      [
        '../videos/reducers',
        '../reducers/index'
      ],
      () => {
        const nextRootReducer = require('../reducers');
        store.replaceReducer(nextRootReducer);
      }
    );
  }

  return store;
};
