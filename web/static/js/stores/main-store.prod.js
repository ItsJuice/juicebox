import { createStore, applyMiddleware, compose } from 'redux';
import { reduxReactRouter } from 'redux-router';
import createHistory from 'history/lib/createBrowserHistory';
import routes from '../routes';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import createSocket from '../sockets/socket-middleware';

const finalCreateStore = compose(
  applyMiddleware(
    thunk
  ),
  applyMiddleware(createSocket({
    socketURL: '/stream',
    channelName: 'stream:main',
    actions: {
      "video.added": videoAdded
    }
  })),
  reduxReactRouter({
    routes,
    createHistory
  })
)(createStore);

export default function configureStore(initialState) {
  const store = finalCreateStore(
    rootReducer,
    initialState
  );

  return store;
};
