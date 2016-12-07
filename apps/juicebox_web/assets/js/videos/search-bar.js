import React, { Component } from 'react';
import { debounce } from 'lodash';

function _smartSearch(state) { // the action extracts `term`
  debounce(state => {
    this.props.search(state);
  }, 500);
}

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = { term: '' };
    _smartSearch = _smartSearch.bind(this);
  }

  render() {
    return (
      <div className="search">
        <h2>Search</h2>
        <input
          type="text"
          value={this.state.term}
          onChange={_smartSearch(this.state)}
        />
      </div>
    );
  }
}

export default SearchBar;
