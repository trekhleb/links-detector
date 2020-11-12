import React, { CSSProperties } from 'react';
import './Spinner.css';
import { DETECTION_BACKGROUND_COLOR_CLASS } from '../../constants/style';

function Spinner(): React.ReactElement {
  const spinnerStyles: CSSProperties = {
    width: '100%',
    height: '100%',
    transformOrigin: 'top left',
    animation: 'sk-scaleout 1.2s ease-in-out infinite',
  };

  return (
    <div
      style={spinnerStyles}
      className={`${DETECTION_BACKGROUND_COLOR_CLASS} fade-in-5 rounded`}
    />
  );
}

export default Spinner;
