import { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { createStore } from 'redux';

import { subscribeToStream } from '../../../../assets/js/sockets';

describe('subscribeToStream()', () => {
  let store;
  let actionStub;
  let streamId = 'b*witched';

  const testAction = { type: 'any' };
  const streamIdFake = () => streamId;

  beforeEach(() => {
    actionStub = sinon.stub().returns(testAction);
    store = createStore(() => ({}));
    sinon.spy(store, 'subscribe');
    sinon.spy(store, 'dispatch');
  });

  context('with a store and an action', () => {
    beforeEach(() => {
      subscribeToStream({ store: store, action: actionStub, getStreamId: streamIdFake });
    });

    it('subscribes to changes in the store', () => {
      expect(store.subscribe).to.have.been.calledOnce;
    });

    it('dispatches the action when the streamId param changes', () => {
      store.dispatch(testAction);
      expect(actionStub).to.have.been.calledWith('b*witched');
      expect(store.dispatch).to.have.been.calledWith(testAction);
    });

    context('called multiple times', () => {
      describe('with the same streamId', () => {
        it('only dispatches the action once', () => {
          store.dispatch(testAction);
          store.dispatch(testAction);
          expect(actionStub).to.have.been.calledOnce;
        });
      });

      describe('with a different streamId', () => {
        it('dispatches the action once per streamId', () => {
          store.dispatch(testAction);
          expect(actionStub).to.have.been.calledWith('b*witched');
          expect(store.dispatch).to.have.been.calledWith(testAction);

          streamId = 'east17';
          store.dispatch(testAction);
          expect(actionStub).to.have.been.calledWith('east17');
          expect(store.dispatch).to.have.been.calledWith(testAction);
        });
      });
    });

  });
});
