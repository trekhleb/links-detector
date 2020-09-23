import React from 'react';
import { useHistory } from 'react-router-dom';

import LiveDetector from '../elements/LiveDetector';
import Modal from '../shared/Modal';
import { RouteNames, ROUTES } from '../../constants/routes';

function DetectorScreen(): React.ReactElement {
  const history = useHistory();

  const onModalClose = (): void => {
    history.push(ROUTES[RouteNames.home].path);
  };

  return (
    <Modal onClose={onModalClose}>
      <LiveDetector />
    </Modal>
  );
}

export default DetectorScreen;
