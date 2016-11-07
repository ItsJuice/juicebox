import { expect } from 'chai';
import { connectToChannel, CONNECT_TO_CHANNEL } from '../../../../assets/js/sockets';

describe('connectToChannel action', () => {
  context('with a channel (streamId)', () => {

    it('returns a valid action', () => {
      expect(connectToChannel('juan.sheet')).to.eql({
        type: CONNECT_TO_CHANNEL,
        channel: 'juan.sheet'
      });
    });

  });
});
