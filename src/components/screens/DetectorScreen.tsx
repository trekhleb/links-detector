import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Location, PartialPath } from 'history';

import LinksDetector from '../elements/LinksDetector';
import Modal from '../shared/Modal';
import { RouteNames, ROUTES } from '../../constants/routes';

function DetectorScreen(): React.ReactElement {
  const history = useHistory();
  const location: Location = useLocation();

  const onModalClose = (): void => {
    const path: PartialPath = {
      pathname: ROUTES[RouteNames.home].path,
      search: location.search,
      hash: location.hash,
    };
    history.push(path);
  };

  return (
    <Modal onClose={onModalClose}>
      <LinksDetector />
    </Modal>
  );
}

export default DetectorScreen;
