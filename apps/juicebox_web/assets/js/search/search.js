import React, { Component } from 'react';
import { connect } from 'react-redux';
import { receiveTerm } from './actions';
import { addVideo } from '../videos/actions';
import SearchBar from './search-bar';
import ResultList from './result-list';

class Search extends Component {
  constructor(props) {
    super(props);
    this.handleVideoAdded = this.handleVideoAdded.bind(this);
  }

  handleVideoAdded(video) {
    console.log(this.props.streamId, video);
    this.props.addVideo({
      streamId: this.props.streamId,
      video: video
    });
  }

  render() {
    return (
      <div>
        <SearchBar receiveTerm={this.props.receiveTerm} />
        <ResultList results={this.props.results} onSelect={ this.handleVideoAdded } />
      </div>
    );
  }
}

const mapStateToProps = ({ search }) => {
  return {
    results: search.results,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    receiveTerm: ({ term }) => {
      dispatch(receiveTerm({ term }));
    },
    addVideo: (video) => {
      dispatch(addVideo(video));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
