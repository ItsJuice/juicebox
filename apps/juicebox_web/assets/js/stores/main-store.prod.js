import { createStore, applyMiddleware, compose } from 'redux';
import { reduxReactRouter } from 'redux-router';
import createHistory from 'history/lib/createBrowserHistory';
import routes from '../routes';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { createSocket, connectToChannel, subscribeToStream } from '../sockets';

const finalCreateStore = compose(
  applyMiddleware(
    thunk
  ),
  applyMiddleware(createSocket()),
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

  subscribeToStream({action: connectToChannel, store});

  return store;
};
