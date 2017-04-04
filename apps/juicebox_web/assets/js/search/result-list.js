import React, { Component, PropTypes } from 'react';
import Result from './result';
import styles from './results.scss';

class ResultList extends Component {
  constructor(props) {
    super(props);
  }

  results() {
    return this.props.results || [];
  }

  render() {
    return (
      <div className={ styles['result-list'] }>
        <ul>
          {
            this.results().map(result =>
              <Result result={result}
                      onSelect={ this.props.onSelect }
                      key={ result.video_id } />)
          }
        </ul>
      </div>
    );
  }
}

ResultList.propTypes = {
  onSelect: PropTypes.func,
  results: PropTypes.array,
};

export default ResultList;
