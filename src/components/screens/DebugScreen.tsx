import React from 'react';

import DebugInfo from '../elements/DebugInfo';
import PageTitle from '../shared/PageTitle';

function DebugScreen(): React.ReactElement {
  return (
    <>
      <PageTitle />
      <DebugInfo />
    </>
  );
}

export default DebugScreen;
