import React from 'react';
import { useHistory } from 'react-router-dom';

import LinksDetector from '../elements/LinksDetector';
import Modal from '../shared/Modal';
import { RouteNames, ROUTES } from '../../constants/routes';
import ErrorBoundary from '../shared/ErrorBoundary';

function DetectorScreen(): React.ReactElement {
  const history = useHistory();

  const onModalClose = (): void => {
    history.push(ROUTES[RouteNames.home].path);
  };

  return (
    <ErrorBoundary>
      <Modal onClose={onModalClose}>
        <LinksDetector />
      </Modal>
    </ErrorBoundary>
  );
}

export default DetectorScreen;
