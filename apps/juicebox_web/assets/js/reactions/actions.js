const SEND_REACTION = 'SEND_REACTION';
const NEW_REACTION = 'NEW_REACTION';
const NEXT_REACTION = 'NEXT_REACTION';

function sendReaction({ streamId, video }) {
  return {
    type: SEND_REACTION,
    socketData: {
      event: 'new.reaction',
      payload: {
        video: video
      }
    }
  }
}

function receiveReaction(video) {
  return {
    type: NEW_REACTION,
    video: video
  }
}

function nextReaction() {
  return {
    type: NEXT_REACTION
  }
}

export {
  SEND_REACTION,
  NEW_REACTION,
  NEXT_REACTION,
  sendReaction,
  receiveReaction,
  nextReaction,
};
