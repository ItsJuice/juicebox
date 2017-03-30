import React, { Component, PropTypes } from 'react';
import { frameAssets } from './frames';

function drawVideo(ctx, video, targetWidth, targetHeight) {
  const videoAspectRatio = video.videoWidth / video.videoHeight;
  const height = targetHeight;
  const width = height * videoAspectRatio;

  const x = (targetWidth / 2) - (width / 2);
  const y = (targetHeight / 2) - (height / 2);

  ctx.drawImage(video, x, y, width, height);
}

class VideoFrame extends Component {
  constructor(props) {
    super(props);
    this.renderFrame = this.renderFrame.bind(this);
  }

  componentDidMount() {
    this.ctx = this.canvas.getContext('2d');
    this.renderFrame();
  }

  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  }

  renderFrame() {
    const { frame, mask } = frameAssets(this.props.frame);
    const frameAspectRatio = (frame.naturalHeight / frame.naturalWidth);
    const width = this.canvas.offsetWidth;
    const height = width * frameAspectRatio;

    this.resize(width, height);

    this.ctx.drawImage(mask, 0, 0, width, height);

    this.ctx.save();
      this.ctx.globalCompositeOperation = 'source-in';
      drawVideo(this.ctx, this.video, width, height);
    this.ctx.restore();

    this.ctx.drawImage(frame, 0, 0, width, height);

    window.requestAnimationFrame(this.renderFrame);
  }

  render() {
    return (
      <div className={ this.props.className }>
        <canvas ref={ (canvas) => { this.canvas = canvas } }></canvas>
        <video
          autoPlay
          loop
          ref={ (video) => { this.video = video } }
          src={ this.props.src }>
        </video>
      </div>
    );
  }
}

VideoFrame.propTypes = {
  src: PropTypes.string,
  frame: PropTypes.string,
  className: PropTypes.string
};

export default VideoFrame;
