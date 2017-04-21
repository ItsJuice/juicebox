const ADD_VIDEO = 'ADD_VIDEO';
const QUEUE_UPDATED = 'QUEUE_UPDATED';
const PLAYING_CHANGED = 'PLAYING_CHANGED';
const TOGGLE_EXPANDED = 'TOGGLE_EXPANDED';

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

function queueUpdated(videos) {
  return {
    type: QUEUE_UPDATED,
    videos: videos.queue
  };
}

function toggleExpanded() {
  return {
    type: TOGGLE_EXPANDED,
  }
}

export {
  ADD_VIDEO,
  QUEUE_UPDATED,
  PLAYING_CHANGED,
  TOGGLE_EXPANDED,
  addVideo,
  queueUpdated,
  toggleExpanded,
};
