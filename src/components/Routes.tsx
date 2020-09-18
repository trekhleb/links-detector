import React from 'react';
import {Switch, Route} from 'react-router-dom';

import {ROUTES} from '../constants/routes';
import HomeScreen from './screens/HomeScreen';
import DetectorScreen from './screens/DetectorScreen';

function Routes(): React.ReactElement {
  return (
    <Switch>
      <Route path={ROUTES.home} exact>
        <HomeScreen />
      </Route>
      <Route path={ROUTES.detector} exact>
        <DetectorScreen />
      </Route>
    </Switch>
  );
}

export default Routes;
