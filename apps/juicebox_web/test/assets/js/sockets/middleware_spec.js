import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { createSocket, CONNECT_TO_CHANNEL } from '../../../../assets/js/sockets';

describe('socket middleware', () => {
  chai.use(sinonChai);

  let doDispatch = () => {};
  let videoAdded = () => {};
  let channelStub;
  let socketStub;
  let socketMiddleware;

  beforeEach(() => {
    channelStub = {
      leave: sinon.spy(),
      on: sinon.spy(),
      join: sinon.spy(),
      push: sinon.spy()
    };

    socketStub = {
      channel: sinon.stub().returns(channelStub)
    };

    socketMiddleware = createSocket(socketStub);
  });

  describe('initialising the middleware', () => {
    it('returns a function', () => {
      const nextHandler = socketMiddleware( { dispatch: doDispatch } );
      expect(nextHandler).to.be.a('function');
    });
  });

  describe('calling the next handler', () => {
    const nextSpy = sinon.spy();

    it('returns a function', () => {
      const nextHandler = socketMiddleware( { dispatch: doDispatch } );
      const actionHandler = nextHandler(nextSpy);
      expect(actionHandler).to.be.a('function');
    });
  });

  describe('joining a stream', () => {
    const nextSpy = sinon.spy();
    let actionHandler;

    beforeEach(() => {
      const nextHandler = socketMiddleware( { dispatch: doDispatch } );
      actionHandler = nextHandler(nextSpy);
      actionHandler({ type: CONNECT_TO_CHANNEL, channel: 'juan.sheet' });
    });

    context('with one CONNECT_TO_CHANNEL action', () => {
      it('connects to the topic', () => {
        expect(socketStub.channel).to.have.been.calledWith('stream:juan.sheet');
      });

      it('joins the channel', () => {
        expect(channelStub.join).to.have.been.calledOnce;
      });
    });

    context('with a second CONNECT_TO_CHANNEL action', () => {
      beforeEach(() => {
        actionHandler({ type: CONNECT_TO_CHANNEL, channel: 'does.plenty' });
      });

      it('leaves the current channel', () => {
        expect(channelStub.leave).to.have.been.calledOnce;
      });

      it('connects to the topic', () => {
        expect(socketStub.channel).to.have.been.calledWith('stream:juan.sheet');
        expect(socketStub.channel).to.have.been.calledWith('stream:does.plenty');
      });

      it('joins the new channel', () => {
        expect(channelStub.join).to.have.been.calledTwice;
      });
    });

  });

  describe('calling the action handler with an action', () => {
    const nextSpy = sinon.spy();

    context('with an action not having socketData', () => {
      const action = {
        type: 'ADD_VIDEO'
      };

      it('calls the next function with the same action', () => {
        const nextHandler = socketMiddleware( { dispatch: doDispatch } );
        const actionHandler = nextHandler(nextSpy);
        actionHandler(action);
        expect(nextSpy).to.have.been.calledWith(action);
      });
    });

    context('with an action with socketData', () => {
      const type = 'ADD_VIDEO';
      const event = 'video.added';
      const payload = {
        video_id: 1
      };
      const action = {
        type,
        socketData: {
          event,
          payload
        }
      };

      it('pushes the data to the channel', () => {
        const nextHandler = socketMiddleware( { dispatch: doDispatch } );
        const actionHandler = nextHandler(nextSpy);
        actionHandler({ type: CONNECT_TO_CHANNEL });
        actionHandler(action);
        expect(channelStub.push).to.have.been.calledWith(event, payload);
      });

      it('calls the next function with the action with the socketData removed', () => {
        const nextHandler = socketMiddleware( { dispatch: doDispatch } );
        const actionHandler = nextHandler(nextSpy);
        actionHandler(action);
        expect(nextSpy).to.have.been.calledWith( { type } );
      });
    });
  });
});
