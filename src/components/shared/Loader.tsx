import React from 'react';
import './Loader.css';

type LoaderProps = {};

function Loader(props: LoaderProps): React.ReactElement {
  return (
    <div className="spinner" />
  );
}

export default Loader;
