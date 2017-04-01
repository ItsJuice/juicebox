import { matchPath } from 'react-router';

function checkStreamChange(action, store, oldStream) {
  const path = '/stream/:streamId';
  const match = matchPath(document.location.pathname, { path });
  const newStream = match && match.params.streamId;

  if (newStream === oldStream) { return oldStream; }

  store.dispatch(action(newStream));
  return newStream;
}

export default ({ action, store }) => {
  let oldStream = checkStreamChange(action, store, oldStream);

  store.subscribe(() => {
    oldStream = checkStreamChange(action, store, oldStream);
  });
}
