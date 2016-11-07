const CONNECT_TO_CHANNEL = 'CONNECT_TO_CHANNEL';

function connectToChannel(channel) {
  return {
    type: CONNECT_TO_CHANNEL,
    channel: channel
  }
}

export {
  CONNECT_TO_CHANNEL,
  connectToChannel
};
