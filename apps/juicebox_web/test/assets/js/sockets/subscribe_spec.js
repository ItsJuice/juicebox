import { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { createStore } from 'redux';

import { subscribeToStream } from '../../../../assets/js/sockets';

describe('subscribeToStream()', () => {
  let store;
  let actionStub;
  let routeAction = { type: 'anything' };
  let testAction = { type: 'triggered' };
  let changedState = { router: { params: { streamId: 'puggle' } } };

  beforeEach(() => {
    actionStub = sinon.stub().returns(testAction);
    store = createStore((state, action) => action === routeAction ? changedState : state);
    sinon.spy(store, 'subscribe');
    sinon.spy(store, 'dispatch');
  });

  context('with a store and an action', () => {
    beforeEach(() => {
      subscribeToStream({ store: store, action: actionStub });
    });

    it('subscribes to changes in the store', () => {
      expect(store.subscribe).to.have.been.calledOnce;
    });

    it('dispatches the action when the streamId param changes', () => {
      store.dispatch(routeAction);
      expect(actionStub).to.have.been.calledWith('puggle');
      expect(store.dispatch).to.have.been.calledWith(testAction);
    });

    context('called multiple times', () => {
      it('only dispatches the action once', () => {
        store.dispatch(routeAction);
        store.dispatch(routeAction);
        expect(actionStub).to.have.been.calledOnce;
      });
    });

  });
});
