import React from 'react';
import ErrorBoundary from '../shared/ErrorBoundary';

function HomeScreen(): React.ReactElement {
  return (
    <ErrorBoundary>
      <h1>Home</h1>
    </ErrorBoundary>
  );
}

export default HomeScreen;
