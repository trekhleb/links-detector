import React from 'react';
import ErrorBoundary from '../shared/ErrorBoundary';

function NoteFoundScreen(): React.ReactElement {
  return (
    <ErrorBoundary>
      <div>
        Page not found
      </div>
    </ErrorBoundary>
  );
}

export default NoteFoundScreen;
