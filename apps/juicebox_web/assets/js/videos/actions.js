const ADD_VIDEO = 'ADD_VIDEO';
const LOAD_STATE = 'ADD_VIDEO';
const QUEUE_UPDATED = 'QUEUE_UPDATED';
const PLAYING_CHANGED = 'PLAYING_CHANGED';

function addVideo({ streamId, video }) {
  return {
    type: ADD_VIDEO,
    socketData: {
      event: 'video.added',
      payload: {
        stream_id: streamId,
        video: video
      }
    }
  };
}

function loadInitialState() {
  return {
    type: LOAD_STATE,
    socketData: {
      event: 'video.getState',
      payload: {
        stream_id: 'main',
      }
    }
  };
}

function queueUpdated(videos) {
  return {
    type: QUEUE_UPDATED,
    videos: videos.queue
  };
}

export {
  ADD_VIDEO,
  QUEUE_UPDATED,
  PLAYING_CHANGED,
  addVideo,
  queueUpdated,
  loadInitialState,
};
