import { matchPath } from 'react-router';

export default ({ action, store }) => {
  let oldStream;

  store.subscribe(() => {
    const path = '/stream/:streamId';
    const match = matchPath(document.location.pathname, { path });
    const newStream = match && match.params.streamId;
    if (newStream !== oldStream) {
      oldStream = newStream;
      store.dispatch(action(newStream));
    }
  });
}
