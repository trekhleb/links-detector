import React, { CSSProperties } from 'react';
import './Spinner.css';
import { DETECTION_BACKGROUND_COLOR } from '../../constants/style';

function Spinner(): React.ReactElement {
  const spinnerWidth: number = 50;

  const spinnerStyles: CSSProperties = {
    width: `${spinnerWidth}px`,
    height: `${spinnerWidth}px`,
    marginLeft: `-${Math.floor(spinnerWidth / 2)}px`,
    marginTop: `-${Math.floor(spinnerWidth / 2)}px`,
    borderRadius: '100%',
    animation: 'sk-scaleout 1.0s infinite ease-in-out',
    backgroundColor: DETECTION_BACKGROUND_COLOR,
  };

  return (
    <div style={spinnerStyles} />
  );
}

export default Spinner;
