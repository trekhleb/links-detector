import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { ROUTES } from '../constants/routes';
import HomeScreen from './screens/HomeScreen';
import DetectorScreen from './screens/DetectorScreen';
import NoteFoundScreen from './screens/NotFoundScreen';
import DebugInfo from './elements/DebugInfo';
import ErrorBoundary from './shared/ErrorBoundary';

function Routes(): React.ReactElement {
  return (
    <Switch>
      <Route path={ROUTES.home.path} exact>
        <ErrorBoundary>
          <HomeScreen />
        </ErrorBoundary>
      </Route>
      <Route path={ROUTES.detector.path} exact>
        <ErrorBoundary>
          <DetectorScreen />
        </ErrorBoundary>
      </Route>
      <Route path={ROUTES.debug.path} exact>
        <ErrorBoundary>
          <DebugInfo />
        </ErrorBoundary>
      </Route>
      <Route>
        <ErrorBoundary>
          <NoteFoundScreen />
        </ErrorBoundary>
      </Route>
    </Switch>
  );
}

export default Routes;
