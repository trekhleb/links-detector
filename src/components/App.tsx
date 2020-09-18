import React from 'react';
import {BrowserRouter} from 'react-router-dom'

import Template from './shared/Template';
import Routes from './Routes';

function App(): React.ReactElement {
  return (
    <BrowserRouter>
      <Template>
        <Routes/>
      </Template>
    </BrowserRouter>
  );
}

export default App;
