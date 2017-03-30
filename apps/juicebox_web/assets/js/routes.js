import React from 'react';
import { Router, Route } from 'react-router';
import { Container } from './container';
import { VideoPage } from './videos';

function AppRouter( { history } ) {
  return  <Router history={ history }>
            <Container>
              <Route path="/stream/:streamId" component={ VideoPage } />
            </Container>
          </Router>
}

AppRouter.propTypes = {
  history: React.PropTypes.object
}

export default AppRouter;
