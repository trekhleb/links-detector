import React from 'react';
import { ICON_KEYS } from '../../icons';
import Icon from './Icon';

export enum NotificationLevel {
  INFO,
  WARNING,
  DANGER,
}

export enum NotificationPosition {
  INLINE,
  FLOATING,
}

type NotificationProps = {
  children: React.ReactNode,
  level?: NotificationLevel,
  position?: NotificationPosition,
};

function Notification(props: NotificationProps): React.ReactElement {
  const {
    children,
    // position = NotificationPosition.INLINE,
    level = NotificationLevel.INFO,
  } = props;

  let bgColor;
  let textColor;
  let borderColor;

  switch (level) {
  case NotificationLevel.DANGER:
    bgColor = 'bg-red-600';
    textColor = 'text-white';
    borderColor = bgColor;
    break;

  case NotificationLevel.WARNING:
    bgColor = 'bg-yellow-600';
    textColor = 'text-white';
    borderColor = bgColor;
    break;

  case NotificationLevel.INFO:
    bgColor = 'bg-blue-600';
    textColor = 'text-white';
    borderColor = bgColor;
    break;

  default:
    bgColor = 'bg-white';
    textColor = 'text-black';
    borderColor = 'border-black';
  }

  return (
    <div className={`${bgColor} ${textColor} ${borderColor} border-solid p-3 rounded text-xs flex flex-row justify-center items-center`}>
      <div className="mr-3">
        <Icon iconKey={ICON_KEYS.ALERT_CIRCLE} className="w-6 h-6" />
      </div>
      <div className="flex-grow">
        {children}
      </div>
    </div>
  );
}

export default Notification;
