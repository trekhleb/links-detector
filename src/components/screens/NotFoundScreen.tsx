import React from 'react';
import { Link } from 'react-router-dom';
import { HOME_ROUTE } from '../../constants/routes';
import Notification, { NotificationLevel } from '../shared/Notification';

function NoteFoundScreen(): React.ReactElement {
  return (
    <Notification level={NotificationLevel.WARNING}>
      <div>
        Page not found
      </div>
      <div>
        Try to start from <Link to={HOME_ROUTE.path} className="underline">Homepage</Link>
      </div>
    </Notification>
  );
}

export default NoteFoundScreen;
