import React, { Component } from 'react';

const WAIT_TIME = 1500;

function _resetTimer(timer) {
  if (timer) { clearTimeout(timer) };
}

function _smartSearch() {
  const { search } = this.props;
  const { state: { timer } } = this;

  _resetTimer(timer);
  timer = setTimeout(state => { search(state); }, WAIT_TIME);
}

class SearchBar extends Component {
  constructor(props) {
    super(props);
    _smartSearch = _smartSearch.bind(this);

    this.state = {
      timer: null,
      term: '',
    };
  }

  render() {
    return (
      <div className="search">
        <h2>Search</h2>
        <input
          type="text"
          value={this.state.term}
          onChange={_smartSearch}
        />
      </div>
    );
  }
}

export default SearchBar;
