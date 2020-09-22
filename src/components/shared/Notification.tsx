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
    position = NotificationPosition.INLINE,
    level = NotificationLevel.INFO,
  } = props;

  let bgColor;

  switch (level) {
    case NotificationLevel.DANGER:
      bgColor = 'bg-red-100';
      break;

    case NotificationLevel.WARNING:
      bgColor = 'bg-yellow-100';
      break;

    case NotificationLevel.INFO:
      bgColor = 'bg-blue-100';
      break;

    default:
      bgColor = 'bg-white';
  }

  const notificationBody: React.ReactElement = (
    <div className={`${bgColor}`}>
      {children}
    </div>
  );

  return notificationBody;
}

export default Notification;
