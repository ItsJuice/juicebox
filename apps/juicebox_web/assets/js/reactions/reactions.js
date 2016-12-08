import React, { Component } from 'react';
import { connect } from 'react-redux';
import { map } from 'lodash';
import { sendReaction } from './actions';
import ReactionRecorder from './recorder';
import ReactionPlayer from './player';

class Reactions extends Component {
  reactions() {
    return map(this.props.reactions, (video, userId) => {
      return <ReactionPlayer reaction={video} key={userId} />
    });
  }

  render() {
    return (
      <div>
        <ReactionRecorder onRecord={_send.bind(this)} />
        <div className="reactions">
          { this.reactions() }
        </div>
      </div>
    );
  }
}

function _send(video) {
  this.props.sendReaction({
    streamId: this.props.params.streamId,
    video
  });
}

function mapStateToProps(state) {
  return {
    reactions: state.reactions
  }
}

export default connect(mapStateToProps, { sendReaction })(Reactions);
