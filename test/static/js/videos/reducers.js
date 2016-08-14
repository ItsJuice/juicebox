import { expect } from 'chai';
import { videos as reducer} from '../../../../web/static/js/videos/reducers';
import { VIDEO_ADDED } from '../../../../web/static/js/videos/actions';

describe('video reducer', () => {
  context('with an unknown action', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const initialState = [];

    it('returns the initial state', () => {
      expect(reducer(initialState, action)).to.eq(initialState);
    });
  });

  context('with the VIDEO_ADDED action', () => {
    const newVideo = 'newVideo';
    const action = { type: VIDEO_ADDED, video: newVideo };

    context('with an empty initial state', () => {
      const initialState = [];
      it('adds the video to the array', () => {
        expect(reducer(initialState, action)).to.deep.equal([newVideo]);
      });
    });

    context('with an empty initial state', () => {
      const oldVideo = 'oldVideo';
      const initialState = [oldVideo];
      it('adds the video to the array', () => {
        expect(reducer(initialState, action)).to.deep.equal([oldVideo, newVideo]);
      });
    });
  });
});