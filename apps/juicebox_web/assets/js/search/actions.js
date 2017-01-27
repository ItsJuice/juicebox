const RECEIVE_TERM = 'RECEIVE_TERM';
const RECEIVE_RESULTS = 'RECEIVE_RESULTS';

function receiveResults(results) {
  return {
    type: RECEIVE_RESULTS,
    payload: results,
  };
}

function receiveTerm({ term }) {
  return dispatch => {
    fetch(`/api/videos?q=${term}`, {
      method: 'get'
    }).then(function(response) {
      if (response.status === '500') {
        // Handle response errors
      } else {
        response.json().then(results => {
          dispatch(receiveResults(results));
        });
      }
    }).catch(function() {
      // Handle request errors
    });
  };
}

export {
  RECEIVE_TERM,
  RECEIVE_RESULTS,
  receiveTerm,
  receiveResults,
};
