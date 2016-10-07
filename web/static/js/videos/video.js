import React, { Component } from 'react';

class Video extends Component {
  render() {
    return (
      <div className="video" style={{display: 'inline-block'}}>
        <iframe width="280"
                height="157"
                src={`http://www.youtube.com/embed/${this.props.video.video_id}`}
                frameBorder="0"
                allowFullScreen>

        </iframe>
      </div>
    );
  }
}

export default Video;
