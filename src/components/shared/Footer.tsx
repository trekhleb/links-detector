import React from 'react';
import HyperLink from './HyperLink';
import { GITHUB_BASE_URL, GITHUB_ISSUES_LINK } from '../../constants/links';
import { ICON_KEYS } from '../../icons';

function Footer(): React.ReactElement {
  return (
    <div>
      <HyperLink to={GITHUB_BASE_URL} iconKey={ICON_KEYS.GIT_HUB}>
        See on GitHub
      </HyperLink>

      <HyperLink to={GITHUB_ISSUES_LINK} iconKey={ICON_KEYS.EDIT}>
        Report a bug
      </HyperLink>
    </div>
  );
}

export default Footer;
