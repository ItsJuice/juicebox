import React, { Component } from 'react';
import { connect } from 'react-redux';
import { search } from './actions';

function _search(e) {
  this.setState({term: e.target.value});

  // If 3 characters or more, bother the API
  if (this.state.term.length > 2) {
    this.props.search(this.state);
  }
}

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = { term: '' };
  }

  render() {
    return (
      <div className="search">
        <h2>Search</h2>
        <input
          type="text"
          value={this.state.term}
          onChange={_search.bind(this)}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    search: ({ term }) => {
      dispatch(search({ term }));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
