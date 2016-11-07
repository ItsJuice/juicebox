export default ({ action, store }) => {
  let oldStream;

  store.subscribe(() => {
    let newStream = store.getState().router.params.streamId;
    if (newStream !== oldStream) {
      oldStream = newStream;
      store.dispatch(action(newStream));
    }
  });
}
