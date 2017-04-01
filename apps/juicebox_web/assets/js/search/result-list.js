import React, { Component, PropTypes } from 'react';
import Result from './result';

class ResultList extends Component {
  constructor(props) {
    super(props);
  }

  results() {
    return this.props.results || [];
  }

  render() {
    const { styles } = this.props;

    return (
      <div className={ styles['result-list'] }>
        <ul>
          {
            this.results().map(result =>
              <Result result={result}
                      onSelect={ this.props.onSelect }
                      key={ result.video_id }
                      styles={ styles }/>)
          }
        </ul>
      </div>
    );
  }
}

ResultList.propTypes = {
  onSelect: PropTypes.func,
  results: PropTypes.array,
  styles: PropTypes.object,
};

export default ResultList;
