import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { ROUTES } from '../constants/routes';
import HomeScreen from './screens/HomeScreen';
import DetectorScreen from './screens/DetectorScreen';
import NoteFoundScreen from './screens/NotFoundScreen';
import DebugInfo from './elements/DebugInfo';

function Routes(): React.ReactElement {
  return (
    <Switch>
      <Route path={ROUTES.home.path} exact>
        <HomeScreen />
      </Route>
      <Route path={ROUTES.detector.path} exact>
        <DetectorScreen />
      </Route>
      <Route path={ROUTES.debug.path} exact>
        <DebugInfo />
      </Route>
      <Route>
        <NoteFoundScreen />
      </Route>
    </Switch>
  );
}

export default Routes;
