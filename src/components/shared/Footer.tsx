import React from 'react';

import HyperLink from './HyperLink';
import { GITHUB_BASE_URL, GITHUB_ISSUES_LINK } from '../../constants/links';
import { ICON_KEYS } from '../../icons';
import { ROUTES } from '../../constants/routes';

function Footer(): React.ReactElement {
  return (
    <footer>
      <div className="flex flex-row fade-in-5">
        <HyperLink to={GITHUB_BASE_URL} iconKey={ICON_KEYS.GIT_HUB} className="mr-4">
          About
        </HyperLink>

        <HyperLink to={ROUTES.demo.path} iconKey={ICON_KEYS.YOUTUBE} routerLink className="mr-4">
          Demo
        </HyperLink>

        <HyperLink to={GITHUB_ISSUES_LINK} iconKey={ICON_KEYS.EDIT}>
          Issues
        </HyperLink>
      </div>
    </footer>
  );
}

export default Footer;
