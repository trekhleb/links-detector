import React from 'react';
import { Router } from 'react-router-dom';
import { Action, createBrowserHistory, Location } from 'history';

import Template from './shared/Template';
import Routes from './Routes';
import ErrorBoundary from './shared/ErrorBoundary';
import { gaPageView } from '../utils/analytics';

const history = createBrowserHistory();

history.listen((location: Location, action: Action): void => {
  gaPageView(location, action);
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
