import React from 'react';
import { ICON_KEYS, ICONS } from '../../icons';

type IconProps = {
  iconKey: ICON_KEYS,
  className?: string | undefined,
};

function Icon(props: IconProps): React.ReactElement | null {
  const { iconKey, className } = props;

  if (!Object.prototype.hasOwnProperty.call(ICONS, iconKey)) {
    return null;
  }

  const icon = ICONS[iconKey];
  const IconComponent = icon.component;

  const fillCurrent = Object.prototype.hasOwnProperty.call(icon, 'fillCurrent')
    ? icon.fillCurrent
    : true;

  const fillCurrentClass = fillCurrent ? 'fill-current' : '';

  return (
    <IconComponent className={`${fillCurrentClass} ${className || ''}`} />
  );
}

export default Icon;
