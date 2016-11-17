import React, { Component } from 'react';
import { connect } from 'react-redux';
import { sendReaction, nextReaction } from './actions';
import ReactionRecorder from './recorder';
import ReactionPlayer from './player';

class Reactions extends Component {
  render() {
    return (
      <div>
        <ReactionRecorder onRecord={_send.bind(this)} />
        <ReactionPlayer reaction={this.props.reaction} onEnded={this.props.nextReaction} />
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
    reaction: state.reactions[0]
  }
}

export default connect(mapStateToProps, { sendReaction, nextReaction })(Reactions);
