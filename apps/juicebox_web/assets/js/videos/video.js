import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import show from '../lib/show-when';
import styles from './video.scss';
import ExpandButton from './buttons/expand.svg';
import MinimiseButton from './buttons/minimise.svg';
import Boo from './buttons/boo.svg';

function skipRatioToClassname(ratio, prefix, num = 5) { 
  let index = Math.round(ratio * num - 1) + 1;
  index = Math.min(num, index);
  index = Math.max(1, index);

  return styles[`${prefix}-${index}`];
}

class Video extends Component {
  skipPlaying = () => {
    this.props.skipPlaying({ streamId: this.props.streamId });
  }

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

  renderBooButton = () => {
    const ratioClass = skipRatioToClassname(this.props.skipRatio, 'skip');

    return <Boo className={ `${styles.boo} ${ratioClass}` } onClick={ this.skipPlaying } />;
  }

  renderTitle() {
    return <div className={ styles['video-title'] }>
             { show(this.renderBooButton).when(this.props.video) }
             <h3>{ this.props.video ? this.props.video.title : 'No video added' }</h3>
           </div>;
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
  skipPlaying: PropTypes.func,
  skipRatio: PropTypes.number,
  streamId: PropTypes.string,
}

export default Video;
