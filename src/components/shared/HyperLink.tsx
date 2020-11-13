import React from 'react';
import { Link } from 'react-router-dom';

import { ICON_KEYS } from '../../icons';
import Icon from './Icon';
import { LINKS_TEXT_HOVER_COLOR_CLASS } from '../../constants/style';

type HyperLinkProps = {
  to: string,
  children: React.ReactNode,
  iconKey?: ICON_KEYS,
  className?: string,
  routerLink?: boolean,
};

function HyperLink(props: HyperLinkProps): React.ReactElement {
  const {
    to,
    children,
    iconKey,
    className = '',
    routerLink = false,
  } = props;

  const icon = iconKey ? (
    <Icon iconKey={iconKey} className="w-4 h-4" />
  ) : null;

  const linkContent = icon ? (
    <span className="flex flex-row justify-center items-center">
      <span className="block">
        {icon}
      </span>
      <span className="flex-grow ml-1 block">
        {children}
      </span>
    </span>
  ) : children;

  const linkClassName: string = `underline text-sm ${className} hover:${LINKS_TEXT_HOVER_COLOR_CLASS}`;

  if (routerLink) {
    return (
      <Link to={to} className={linkClassName}>
        {linkContent}
      </Link>
    );
  }

  return (
    <a href={to} className={linkClassName}>
      {linkContent}
    </a>
  );
}

export default HyperLink;
