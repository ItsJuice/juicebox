import { matchPath } from 'react-router';

function streamIdFromPath() {
  const path = '/stream/:streamId';
  const match = matchPath(document.location.pathname, { path });
  const streamId = match && match.params.streamId;

  return streamId;
}

export default ({ action, store, getStreamId = streamIdFromPath }) => {
  let currentStream = getStreamId();

  const dispatchStreamChange = (streamId) =>
    store.dispatch(action(streamId));

  dispatchStreamChange(currentStream);

  store.subscribe(() => {
    const newStream = getStreamId();

    if (newStream !== currentStream) {
      currentStream = newStream;
      dispatchStreamChange(currentStream);
    }
  });
}
