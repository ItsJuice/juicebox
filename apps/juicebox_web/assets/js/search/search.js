import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { receiveTerm } from './actions';
import { addVideo } from '../videos/actions';
import SearchBar from './search-bar';
import ResultList from './result-list';
import styles from './search.scss';

class Search extends Component {
  constructor(props) {
    super(props);
    this.handleVideoAdded = this.handleVideoAdded.bind(this);
  }

  handleVideoAdded(video) {
    this.props.addVideo({
      streamId: this.props.streamId,
      video: video
    });
  }

  render() {
    return (
      <div className={ styles.search }>
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

Search.propTypes = {
  results: PropTypes.array,
  receiveTerm: PropTypes.func,
  addVideo: PropTypes.func,
  streamId: PropTypes.string,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
