import { Socket } from 'phoenixjs';
import { defaults, omit, forEach } from 'lodash';

const defaultOptions = {};

function createChannel(options) {
  const socket = new Socket(options.socketURL);
  socket.connect();
  const channel = socket.channel(options.channelName, {});
  channel.join()
    .receive('ok', resp => { console.log('Joined successfully', resp) })
    .receive('error', resp => { console.log('Unable to join', resp) });
  return channel;
}

export function createSocket(opts = {}) {
  const options = defaults(opts, defaultOptions);

  return ( { dispatch } ) => {
    const channel = createChannel(options);
    forEach(opts.actions, (action, eventName) => {
      channel.on(eventName, payload => {
        dispatch(action(payload));
      });
    });

    return next => action => {
      const { socketData } = action;

      if (socketData) {
        channel.push(socketData.event, socketData.payload);
        action = omit(action, 'socketData');
      }

      return next(action);
    };
  }
}

export default createSocket;