import React from 'react';
import { Link } from 'react-router-dom';

import Icon from './Icon';
import { ICON_KEYS } from '../../icons';
import EnhancedRow from './EnhancedRow';
import { HOME_ROUTE } from '../../constants/routes';
import { LINKS_TEXT_HOVER_COLOR_CLASS, THEME_BG_COLOR_CLASS } from '../../constants/style';
import { GITHUB_ISSUES_LINK } from '../../constants/links';

function Logo(): React.ReactElement {
  const logoIcon = (
    <Icon iconKey={ICON_KEYS.LINKS_DETECTOR_LOGO} className="w-8 h-8" />
  );

  const content = (
    <>
      <span className="text-3xl">
        <Link to={HOME_ROUTE.path} className={`hover:${LINKS_TEXT_HOVER_COLOR_CLASS}`}>
          Links Detector
        </Link>
      </span>
      <sup className={`text-xs bg-white hover:${THEME_BG_COLOR_CLASS} text-black rounded-full pl-1 pr-1 ml-2`}>
        <a href={GITHUB_ISSUES_LINK}>alpha</a>
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
