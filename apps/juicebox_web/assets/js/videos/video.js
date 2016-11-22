import React, { Component, PropTypes } from 'react';

class Video extends Component {
  render() {
    if (!this.props.video) { return null; }

    return (
      <div className="video" style={{display: 'inline-block'}}>
        <iframe width="280"
                height="157"
                src={`http://www.youtube.com/embed/${this.props.video.video_id}?autoplay=1`}
                frameBorder="0"
                allowFullScreen>

        </iframe>
      </div>
    );
  }
}

Video.propTypes = {
  video: PropTypes.object,
}

export default Video;
