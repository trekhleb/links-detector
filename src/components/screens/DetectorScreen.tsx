import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { History, Location, LocationDescriptor } from 'history';

import LinksDetector from '../elements/LinksDetector';
import Modal from '../shared/Modal';
import { RouteNames, ROUTES } from '../../constants/routes';
import PageTitle from '../shared/PageTitle';
import useLogger from '../../hooks/useLogger';

function DetectorScreen(): React.ReactElement {
  const logger = useLogger({ context: 'DetectorScreen' });
  const history: History = useHistory();
  const location: Location = useLocation();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const onModalClose = (): void => {
    const path: LocationDescriptor = {
      pathname: ROUTES[RouteNames.home].path,
      search: location.search,
      hash: location.hash,
    };
    history.push(path);
  };

  const onLoaded = (): void => {
    logger.logDebug('onLoaded', { loaded });
    if (!loaded) {
      setLoaded(true);
    }
  };

  const onError = (): void => {
    logger.logDebug('onError', { error });
    if (!error) {
      setError(true);
    }
  };

  return (
    <>
      <PageTitle />
      <Modal onClose={onModalClose} disableClose={!(loaded || error)}>
        <LinksDetector onLoaded={onLoaded} onError={onError} />
      </Modal>
    </>
  );
}

export default DetectorScreen;
