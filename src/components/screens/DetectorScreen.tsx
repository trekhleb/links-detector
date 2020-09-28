import React from 'react';
import { useHistory } from 'react-router-dom';

import LiveDetector from '../elements/LiveDetector';
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
        <LiveDetector />
      </Modal>
    </ErrorBoundary>
  );
}

export default DetectorScreen;
