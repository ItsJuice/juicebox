import { expect } from 'chai';
import { videos as reducer} from '../../../../assets/js/videos/reducers';
import { QUEUE_UPDATED } from '../../../../assets/js/videos/actions';

describe('video reducer', () => {
  context('with an unknown action', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const initialState = [];

    it('returns the initial state', () => {
      expect(reducer(initialState, action)).to.eq(initialState);
    });
  });

  context('with the QUEUE_UPDATED action', () => {
    const newVideo = 'newVideo';
    const action = { type: QUEUE_UPDATED, videos: [newVideo] };

    context('with an empty initial state', () => {
      const initialState = [];
      it('uses the new queue', () => {
        expect(reducer(initialState, action)).to.deep.equal( { queue: [newVideo] });
      });
    });

    context('with a non-empty initial state', () => {
      const oldVideo = 'oldVideo';
      const initialState = { queue: [oldVideo] };
      it('replaces the old queue with the new queue', () => {
        expect(reducer(initialState, action)).to.deep.equal({ queue: [newVideo] });
      });
    });
  });
});
