import React, { Component, PropTypes } from 'react';
import { bindAll } from 'lodash/util';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { receiveTerm } from './actions';
import { addVideo } from '../videos/actions';
import SearchBar from './search-bar';
import ResultList from './result-list';
import styles from './search.scss';
import CloseIcon from './close.svg';

class Search extends Component {
  constructor(props) {
    super(props);
    bindAll(this, 'handleVideoAdded', 'setOpen', 'setClosed');

    this.state = {
      open: false,
    };
  }

  handleVideoAdded(video) {
    this.props.addVideo({
      streamId: this.props.streamId,
      video: video
    });
    this.setClosed();
  }

  setOpen() {
    this.setState({ open: true })
  }

  setClosed() {
    this.setState({ open: false })
  }

  render() {
    const { open } = this.state;
    const classes = classnames(styles.search, { [styles['search-open'] ]: open });

    return (
      <div className={ classes }>
        <CloseIcon className={ styles['close-icon'] }
                   onClick={ this.setClosed } />
        <SearchBar receiveTerm={ this.props.receiveTerm }
                   styles={ styles }
                   onOpen={ this.setOpen }/>
        {
          this.state.open && <ResultList results={this.props.results}
                      onSelect={ this.handleVideoAdded } />
        }
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
