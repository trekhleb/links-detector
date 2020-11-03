import React from 'react';
import Icon from './Icon';
import { ICON_KEYS } from '../../icons';
import EnhancedRow from './EnhancedRow';

function Logo(): React.ReactElement {
  const logoIcon = (
    <Icon iconKey={ICON_KEYS.LINKS_DETECTOR_LOGO} className="w-8 h-8" />
  );

  const content = (
    <>
      <span className="text-3xl">
        Links Detector
      </span>
      <sup className="text-xs bg-white text-black rounded-full pl-1 pr-1 ml-2">
        alpha
      </sup>
    </>
  );

  return (
    <EnhancedRow
      content={content}
      contentClassName="ml-2"
      startEnhancer={logoIcon}
    />
  );
}

export default Logo;
