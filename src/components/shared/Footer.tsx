import React from 'react';
import HyperLink from './HyperLink';
import { GITHUB_BASE_URL, GITHUB_ISSUES_LINK } from '../../constants/links';
import { ICON_KEYS } from '../../icons';

function Footer(): React.ReactElement {
  return (
    <footer>
      <div className="flex flex-row">
        <HyperLink to={GITHUB_BASE_URL} iconKey={ICON_KEYS.GIT_HUB} className="mr-4">
          About
        </HyperLink>

        <HyperLink to={GITHUB_ISSUES_LINK} iconKey={ICON_KEYS.EDIT}>
          Issues
        </HyperLink>
      </div>
    </footer>
  );
}

export default Footer;
