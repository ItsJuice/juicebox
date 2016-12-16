import React, { Component } from 'react';
import { debounce } from 'lodash';

const WAIT_TIME = 500;

function smartSearch(e) {
  const term = { term: e.target.value };
  this.setState(term);
  receiveTerm(term);
}

function receiveTerm(term) {
  this.props.receiveTerm(this.state);
}

class SearchBar extends Component {
  constructor(props) {
    super(props);
    smartSearch = smartSearch.bind(this);
    receiveTerm = debounce(receiveTerm.bind(this), WAIT_TIME);
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
