import React, { Component } from 'react';
import { debounce } from 'lodash';

// const WAIT_TIME = 1500;

function smartSearch(e) {
  this.setState({ term: e.target.value });
  this.props.receiveTerm(this.state);
}

class SearchBar extends Component {
  constructor(props) {
    super(props);
    smartSearch = smartSearch.bind(this);
    this.state = { term: '' };
  }

  render() {
    return (
      <div className="search">
        <h2>Search</h2>
        <input
          type="text"
          value={this.state.term}
          onChange={smartSearch}
        />
      </div>
    );
  }
}

export default SearchBar;
