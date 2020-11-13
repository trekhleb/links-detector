import React from 'react';

import PageTitle from '../shared/PageTitle';
import Demo from '../shared/Demo';

function DemoScreen(): React.ReactElement {
  return (
    <>
      <PageTitle />
      <div className="flex justify-center items-center flex-col flex-grow self-stretch fade-in-5">
        <Demo />
      </div>
    </>
  );
}

export default DemoScreen;
