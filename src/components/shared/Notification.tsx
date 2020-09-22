import React from 'react';

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
    bgColor = 'bg-red-100';
    textColor = 'text-red-800';
    borderColor = 'border-red-300';
    break;

  case NotificationLevel.WARNING:
    bgColor = 'bg-orange-100';
    textColor = 'text-orange-800';
    borderColor = 'border-orange-300';
    break;

  case NotificationLevel.INFO:
    bgColor = 'bg-blue-100';
    textColor = 'text-blue-800';
    borderColor = 'border-blue-300';
    break;

  default:
    bgColor = 'bg-white';
    textColor = 'text-black';
    borderColor = 'border-black';
  }

  const notificationBody: React.ReactElement = (
    <div className={`${bgColor} ${textColor} ${borderColor} border-solid p-3 m-3 rounded`}>
      {children}
    </div>
  );

  return notificationBody;
}

export default Notification;
