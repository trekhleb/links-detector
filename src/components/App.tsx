import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Template from './shared/Template';
import Routes from './Routes';
import { BASE_APP_PATH } from '../constants/routes';
import ErrorBoundary from './shared/ErrorBoundary';

function App(): React.ReactElement {
  return (
    <BrowserRouter basename={BASE_APP_PATH}>
      <Template>
        <ErrorBoundary>
          <Routes />
        </ErrorBoundary>
      </Template>
    </BrowserRouter>
  );
}

export default App;
