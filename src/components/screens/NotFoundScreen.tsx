import React from 'react';
import { Link } from 'react-router-dom';
import { HOME_ROUTE } from '../../constants/routes';
import Notification, { NotificationLevel } from '../shared/Notification';
import PageTitle from '../shared/PageTitle';

function NoteFoundScreen(): React.ReactElement {
  return (
    <>
      <PageTitle />
      <div className="flex-grow">
        <Notification level={NotificationLevel.WARNING}>
          <div>
            Page not found
          </div>
          <div>
            Try to start from <Link to={HOME_ROUTE.path} className="underline">Homepage</Link>
          </div>
        </Notification>
      </div>
    </>
  );
}

export default NoteFoundScreen;
