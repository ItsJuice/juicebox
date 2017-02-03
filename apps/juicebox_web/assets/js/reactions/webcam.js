/*global MediaRecorder*/
import VideoEncoder from './video-encoder';

function getMimeType() {
  if (typeof MediaRecorder.isTypeSupported !== 'function') {
    return;
  }

  const mimeType = [
// Force vp8 for chrome & firefox support
//    'video/webm;codecs=h264',
//    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
  ].find(MediaRecorder.isTypeSupported);

  return { mimeType };
}

function startStream(onConnect, stream) {
  this.stream = stream;

  const url = window.URL || window.webkitURL;
  const streamURL = url ? url.createObjectURL(this.stream) : this.stream;


  onConnect(streamURL);
}

class Webcam {
  constructor(opts = {}) {
    this.options = Object.assign({
      'audio': false,
      'video': {
        'mandatory': {
          'minWidth': 320,
          'maxWidth': 320,
          'minHeight': 240,
          'maxHeight': 240
        },
        'optional': []
      }
    }, opts);
  }

  connect() {
    return new Promise(function (resolve, reject) {
      navigator.getUserMedia = (
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia
      );

      navigator.getUserMedia(this.options, startStream.bind(this, resolve), reject);
    }.bind(this));
  }

  disconnect() {
    this.stream.getVideoTracks()[0].stop();
  }

  record() {
    const encoder = new VideoEncoder();
    const recorder = new MediaRecorder(this.stream, getMimeType());

    recorder.ondataavailable = (e) => {
      encoder.write(e.data);
    };

    recorder.start(10);

    return {
      stop: () => {
        return new Promise((resolve) => {
          recorder.stop();
          encoder.encode(resolve);
        });
      }
    };
  }
}

export default Webcam;
