import React, { Component } from 'react';
import { connect } from 'react-redux';
import { search } from './actions';
import SearchBar from './search-bar';
import ResultList from './result-list';

class Search extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <SearchBar search={this.props.search} />
        <ResultList videos={this.props.videos} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    videos: state.videos,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    search: ({ term }) => {
      dispatch(search({ term }));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
