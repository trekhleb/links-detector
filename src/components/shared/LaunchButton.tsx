import React, { CSSProperties } from 'react';
import { LAUNCH_BUTTON_BACKGROUND_HOVER_CLASS } from '../../constants/style';

// import detectionImage from '../../images/detection.gif';

type LaunchButtonProps = {
  onClick: () => void,
  children: React.ReactNode,
};

function LaunchButton(props: LaunchButtonProps): React.ReactElement {
  const { children, onClick } = props;

  const buttonSizePx: number = 180;

  const wrapperStyles: CSSProperties = {
    width: `${buttonSizePx}px`,
    height: `${buttonSizePx}px`,
    overflow: 'visible',
  };

  const buttonBackgroundStyle: CSSProperties = {
    width: `${buttonSizePx}px`,
    height: `${buttonSizePx}px`,
    background: 'rgba(255, 255, 255, .3)',
    border: '1px solid rgba(255, 255, 255, .7)',
    position: 'absolute',
  };

  const buttonStyles: CSSProperties = {
    width: `${buttonSizePx}px`,
    height: `${buttonSizePx}px`,
    // backgroundImage: `url(${detectionImage})`,
    backgroundSize: 'cover',
    overflow: 'hidden',
    position: 'absolute',
  };

  const buttonTextStyles: CSSProperties = {
    width: `${buttonSizePx}px`,
    height: `${buttonSizePx}px`,
    // backgroundColor: 'rgba(255, 255, 255, .7)',
    overflow: 'hidden',
  };

  return (
    <div style={wrapperStyles}>
      <div
        style={buttonBackgroundStyle}
        className="rounded-full pulsate-1"
      />
      <div
        style={buttonBackgroundStyle}
        className="rounded-full pulsate-2"
      />
      <button
        style={buttonStyles}
        onClick={onClick}
        type="button"
        className={
          `flex flex-row items-center justify-center border-0 rounded-full transition duration-300 ease-in-out bg-white hover:${LAUNCH_BUTTON_BACKGROUND_HOVER_CLASS}`
        }
      >
        <div
          style={buttonTextStyles}
          className="flex flex-row items-center justify-center font-light text-5xl text-black"
        >
          { children }
        </div>
      </button>
    </div>
  );
}

export default LaunchButton;
