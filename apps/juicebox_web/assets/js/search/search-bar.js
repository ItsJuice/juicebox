import React, { Component, PropTypes } from 'react';
import { debounce } from 'lodash';

const WAIT_TIME = 500;

function smartSearch(e) {
  const term = { term: e.target.value };
  this.setState(term);
  this.receiveTerm(term);
}

function receiveTerm() {
  this.props.receiveTerm(this.state);
}

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.smartSearch = smartSearch.bind(this);
    this.receiveTerm = debounce(receiveTerm.bind(this), WAIT_TIME);
    this.state = { term: '' };
  }

  render() {
    return (
      <div className="search">
        <input
          type="text"
          value={this.state.term}
          onChange={this.smartSearch}
        />
      </div>
    );
  }
}

SearchBar.propTypes = {
  receiveTerm: PropTypes.func,
};

export default SearchBar;
