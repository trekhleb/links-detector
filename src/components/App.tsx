import React from 'react';
import { Router } from 'react-router-dom';
import { createHashHistory, Location } from 'history';

import Template from './shared/Template';
import Routes from './Routes';
import ErrorBoundary from './shared/ErrorBoundary';
import { gaPageView } from '../utils/analytics';

const history = createHashHistory();

history.listen((location: Location): void => {
  gaPageView(location);
});

function App(): React.ReactElement {
  return (
    <Router history={history}>
      <Template>
        <ErrorBoundary>
          <Routes />
        </ErrorBoundary>
      </Template>
    </Router>
  );
}

export default App;
