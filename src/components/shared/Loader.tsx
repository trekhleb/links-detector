import React from 'react';
import './Loader.css';

type LoaderProps = {
  text?: string,
};

function Loader(props: LoaderProps): React.ReactElement {
  const { text } = props;

  const loaderText = text ? (
    <div className="text-white mt-10 animate-pulse">
      {text}
    </div>
  ) : null;

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="spinner" />
      {loaderText}
    </div>
  );
}

export default Loader;
