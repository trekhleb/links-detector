import React from 'react';
import Icon from './Icon';
import { ICON_KEYS } from '../../icons';

function Header(): React.ReactElement {
  return (
    <header>
      <div className="flex flex-row justify-center items-center">
        <div className="mr-2">
          <Icon iconKey={ICON_KEYS.LINKS_DETECTOR_LOGO} className="w-8 h-8" />
        </div>
        <div className="flex-grow">
          <span className="text-2xl">Links Detector</span>
          &nbsp;
          <sup className="text-xs bg-white text-black rounded">alpha</sup>
        </div>
      </div>
    </header>
  );
}

export default Header;
