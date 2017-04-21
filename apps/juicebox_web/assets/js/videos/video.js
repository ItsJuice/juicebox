import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import styles from './video.scss';
import ExpandButton from './buttons/expand.svg';
import MinimiseButton from './buttons/minimise.svg';

class Video extends Component {
  renderVideo() {
    if (!this.props.video || !this.props.expanded) { return null; }

    return <div className={ styles['video-wrapper'] }>
             <iframe width="280"
                height="157"
                src={`https://www.youtube.com/embed/${this.props.video.video_id}?autoplay=1&start=${this.props.playingStartTime}`}
                frameBorder="0"
                allowFullScreen></iframe>
           </div>;
  }

  renderButton() {
    if (!this.props.video) { return null; }
    const Button = this.props.expanded ? MinimiseButton : ExpandButton;

    return <Button onClick={ this.props.toggleExpanded }
                   className={ styles['video-state-button'] } />;
  }

  renderTitle() {
    return <h3 className={ styles['video-title'] }>
             { this.props.video ? this.props.video.title : 'No video added' }
           </h3>;
  }

  renderContainer() {
    return <div className={ styles['video-container'] }>
             { this.renderVideo() }
             { this.renderButton() }
             { this.renderTitle() }
           </div>;
  }

  render() {
    const { expanded, video } = this.props;
    const classes = classnames(styles.video, {
      [styles['video-expanded']]: expanded,
      [styles['video-present']]: video,
    });

    return (
      <div className={ classes }>
        <h2>Now playing</h2>
        { this.renderContainer() }
      </div>
    );
  }
}

Video.propTypes = {
  video: PropTypes.object,
  playingStartTime: PropTypes.number,
  toggleExpanded: PropTypes.func,
  expanded: PropTypes.bool,
}

export default Video;
