import React from 'react';
import Icon from './Icon';
import { ICON_KEYS } from '../../icons';

function Logo(): React.ReactElement {
  return (
    <div className="flex flex-row justify-center items-center">
      <div className="mr-2">
        <Icon iconKey={ICON_KEYS.LINKS_DETECTOR_LOGO} className="w-8 h-8" />
      </div>
      <div className="flex-grow">
        <span className="text-3xl">
          Links Detector
        </span>
        <sup className="text-xs bg-white text-black rounded-full pl-1 pr-1 ml-2">
          alpha
        </sup>
      </div>
    </div>
  );
}

export default Logo;
