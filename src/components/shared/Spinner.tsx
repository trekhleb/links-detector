import React, { CSSProperties } from 'react';
import './Spinner.css';
import { DETECTION_BACKGROUND_COLOR_CLASS } from '../../constants/style';

function Spinner(): React.ReactElement {
  const spinnerStyles: CSSProperties = {
    width: '100%',
    height: '100%',
    transformOrigin: 'top left',
    animation: 'sk-scaleout 1.5s ease-out infinite',
  };

  return (
    <div
      style={spinnerStyles}
      className={`${DETECTION_BACKGROUND_COLOR_CLASS}`}
    />
  );
}

export default Spinner;
