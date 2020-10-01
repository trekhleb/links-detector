import React from 'react';

import ErrorBoundary from '../shared/ErrorBoundary';
import MainNavigation from '../shared/MainNavigation';

function HomeScreen(): React.ReactElement {
  return (
    <ErrorBoundary>
      <MainNavigation />
    </ErrorBoundary>
  );
}

export default HomeScreen;
