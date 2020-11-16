import React from 'react';
import ReactDOM from 'react-dom';

import './styles/tailwind.css';
import App from './components/App';
import * as serviceWorker from './serviceWorkerRegistration';
import { PWA_ENABLED } from './configs/pwa';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

if (PWA_ENABLED) {
  serviceWorker.register();
} else {
  serviceWorker.unregister();
}
