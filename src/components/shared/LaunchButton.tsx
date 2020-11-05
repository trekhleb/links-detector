import React, { CSSProperties } from 'react';

import detectionImage from '../../images/detection.gif';

type LaunchButtonProps = {
  onClick: () => void,
  children: React.ReactNode,
};

function LaunchButton(props: LaunchButtonProps): React.ReactElement {
  const { children, onClick } = props;

  const buttonStyles: CSSProperties = {
    backgroundImage: `url(${detectionImage})`,
    backgroundSize: 'cover',
  };

  const buttonTextStyles: CSSProperties = {
    backgroundColor: 'rgba(255, 255, 255, .8)',
  };

  return (
    <button
      style={buttonStyles}
      onClick={onClick}
      type="button"
      className="border-0 rounded-full text-black bg-white w-48 h-48 flex flex-row items-center justify-center"
    >
      <div
        style={buttonTextStyles}
        className="font-light text-5xl rounded-full p-6 w-48 h-48 flex flex-row items-center justify-center"
      >
        { children }
      </div>
    </button>
  );
}

export default LaunchButton;
