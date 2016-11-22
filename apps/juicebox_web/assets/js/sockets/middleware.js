import { Socket } from 'phoenixjs';
import { defaults, omit, forEach } from 'lodash';
import { CONNECT_TO_CHANNEL } from '../sockets';

const newSocket = (function() {
  let socket;

  return function() {
    if (!socket) {
      socket = new Socket('/stream');
      socket.connect();
    }

    return socket;
  }
}());

function connect(socket, streamId) {
  const topic = `stream:${streamId}`;
  const channel = socket.channel(topic);
  channel.join()
  return channel;
}

function createSocket(socket = newSocket()) {
  return ( { dispatch } ) => {
    let channel;

    return next => action => {
      const { socketData } = action;

      switch(action.type) {
        case CONNECT_TO_CHANNEL:
          channel && channel.leave();
          channel = connect(socket, action.channel);
          channel.on('remote.action', action => dispatch(action));
        default:
          if (socketData) {
            console.log(socketData);
            channel && channel.push(socketData.event, socketData.payload);
            action = omit(action, 'socketData');
          }
      }

      return next(action);
    };
  }
}

export default createSocket;
