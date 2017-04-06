import React, { Component, PropTypes } from 'react';
import { debounce } from 'lodash';
import SearchIcon from './search.svg';

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
    const { styles } = this.props;
    return (
      <div className={ styles['search-bar'] }>
        <input
          type="text"
          value={ this.state.term }
          onChange={ this.smartSearch }
          onFocus={ this.props.onOpen }
        />
        <SearchIcon className={ styles['search-icon'] }
                    onClick={ this.props.onOpen }/>
      </div>
    );
  }
}

SearchBar.propTypes = {
  receiveTerm: PropTypes.func,
  styles: PropTypes.object,
  onOpen: PropTypes.func,
};

export default SearchBar;
