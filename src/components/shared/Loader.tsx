import React from 'react';

type LoaderProps = {};

function Loader(props: LoaderProps): React.ReactElement {
  return (
    <div className="text-white">
      Loading...
    </div>
  );
}

export default Loader;
