import React from 'react';
import { ICON_KEYS } from '../../icons';
import Icon from './Icon';

type HyperLinkProps = {
  to: string,
  children: React.ReactNode,
  iconKey?: ICON_KEYS,
  className?: string,
};

function HyperLink(props: HyperLinkProps): React.ReactElement {
  const {
    to,
    children,
    iconKey,
    className = '',
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

  return (
    <a href={to} className={`hover:text-yellow-300 underline text-sm ${className}`}>
      {linkContent}
    </a>
  );
}

export default HyperLink;
