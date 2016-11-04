import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import createSocket, { __RewireAPI__ as SocketMiddlewareRewireAPI } from '../../../../assets/js/sockets/socket-middleware';

describe('socket middleware', () => {
  chai.use(sinonChai);

  const doDispatch = () => {};
  const videoAdded = () => {};
  const channelOnSpy = sinon.spy();
  const channelPushSpy = sinon.spy();
  const channelStub = () => ({
    on: channelOnSpy,
    push: channelPushSpy
  });

  beforeEach(() => {
    SocketMiddlewareRewireAPI.__Rewire__('createChannel', channelStub);
  });

  afterEach(() => {
    SocketMiddlewareRewireAPI.__ResetDependency__('createChannel');
  });
  
  const socketMiddleware = createSocket({
    socketURL: '/stream',
    channelName: 'stream:main',
    actions: {
      'video.added': videoAdded
    }
  });

  describe('initialising the middleware', () => {
    it('returns a function', () => {
      const nextHandler = socketMiddleware( { dispatch: doDispatch } );
      expect(nextHandler).to.be.a('function');
    });

    it('adds the channel events', () => {
      expect(channelOnSpy).to.have.been.calledWith('video.added', sinon.match.func);
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
        actionHandler(action);
        expect(channelPushSpy).to.have.been.calledWith(event, payload);
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