import React from 'react';
import logo from './logo.svg';
import './App.css';
import Template from './components/shared/Template';

function App() {
  return (
    <Template>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </Template>
  );
}

export default App;
