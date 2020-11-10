import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Location } from 'history';

import { HOME_ROUTE } from '../../constants/routes';
import Notification, { NotificationLevel } from '../shared/Notification';
import PageTitle from '../shared/PageTitle';
import useLogger from '../../hooks/useLogger';

function NoteFoundScreen(): React.ReactElement {
  const logger = useLogger({ context: 'NoteFoundScreen' });
  const location: Location = useLocation();

  useEffect(() => {
    const path: string = (location.pathname || '') + (location.search || '') + (location.hash || '');
    logger.logError(`page no found: ${path}`);
  }, [logger, location.pathname, location.search, location.hash]);

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
