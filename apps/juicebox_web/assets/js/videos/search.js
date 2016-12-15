import React, { Component } from 'react';
import { connect } from 'react-redux';
import { receiveTerm } from './actions';
import SearchBar from './search-bar';
import ResultList from './result-list';

class Search extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <SearchBar receiveTerm={this.props.receiveTerm} />
        <ResultList videos={this.props.videos} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    videos: state.results,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    receiveTerm: ({ term }) => {
      dispatch(receiveTerm({ term }));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
