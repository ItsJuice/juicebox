import { createStore, applyMiddleware, compose } from 'redux';
import { reduxReactRouter } from 'redux-router';
import DevTools from '../containers/dev-tools';
import createHistory from 'history/lib/createBrowserHistory';
import routes from '../routes';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import createSocket from '../sockets/socket-middleware';
import rootReducer from './reducers';
import { loadInitialState, queueUpdated } from '../videos/actions';

const finalCreateStore = compose(
  applyMiddleware(
    thunk
  ),
  applyMiddleware(createSocket({
    socketURL: '/stream',
    channelName: 'stream:main',
    connectAction: queueUpdated,
    actions: {
      'queue.updated': queueUpdated
    }
  })),
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
