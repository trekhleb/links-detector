import React, { CSSProperties } from 'react';

import detectionImage from '../../images/detection.gif';

type LaunchButtonProps = {
  onClick: () => void,
  children: React.ReactNode,
};

function LaunchButton(props: LaunchButtonProps): React.ReactElement {
  const { children, onClick } = props;

  const buttonSizePx: number = 180;

  const buttonStyles: CSSProperties = {
    width: `${buttonSizePx}px`,
    height: `${buttonSizePx}px`,
    backgroundImage: `url(${detectionImage})`,
    backgroundSize: 'cover',
    overflow: 'hidden',
  };

  const buttonTextStyles: CSSProperties = {
    width: `${buttonSizePx}px`,
    height: `${buttonSizePx}px`,
    backgroundColor: 'rgba(255, 255, 255, .7)',
    overflow: 'hidden',
  };

  return (
    <button
      style={buttonStyles}
      onClick={onClick}
      type="button"
      className="flex flex-row items-center justify-center border-0 rounded-full"
    >
      <div
        style={buttonTextStyles}
        className="flex flex-row items-center justify-center font-light text-5xl text-black"
      >
        { children }
      </div>
    </button>
  );
}

export default LaunchButton;
