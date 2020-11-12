import React, { CSSProperties } from 'react';
import './Spinner.css';
import { DETECTION_BACKGROUND_COLOR_CLASS } from '../../constants/style';

function Spinner(): React.ReactElement {
  const spinnerStyles: CSSProperties = {
    width: '100%',
    height: '100%',
    transformOrigin: 'top left',
    animation: 'sk-scaleout 2.0s cubic-bezier(0, 0, 0.2, 1) infinite',
  };

  return (
    <div
      style={spinnerStyles}
      className={`${DETECTION_BACKGROUND_COLOR_CLASS}`}
    />
  );
}

export default Spinner;
