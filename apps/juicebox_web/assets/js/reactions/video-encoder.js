class VideoEncoder {
  constructor() {
    this.chunks = [];
  }

  write(chunk) {
    this.chunks.push(chunk);
  }

  encode(cb) {
    const blob = new Blob(this.chunks, { type: 'video/webm' });
    const reader  = new FileReader();

    reader.addEventListener('load', () => cb(reader.result), false);
    reader.readAsDataURL(blob);
  }
}

export default VideoEncoder;
