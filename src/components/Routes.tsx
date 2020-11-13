import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { ROUTES } from '../constants/routes';
import HomeScreen from './screens/HomeScreen';
import DetectorScreen from './screens/DetectorScreen';
import NoteFoundScreen from './screens/NotFoundScreen';
import DebugScreen from './screens/DebugScreen';
import DemoScreen from './screens/DemoScreen';

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
        <DebugScreen />
      </Route>
      <Route path={ROUTES.demo.path} exact>
        <DemoScreen />
      </Route>
      <Route>
        <NoteFoundScreen />
      </Route>
    </Switch>
  );
}

export default Routes;
