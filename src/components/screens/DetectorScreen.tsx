import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { History, Location, LocationDescriptor } from 'history';

import LinksDetector from '../elements/LinksDetector';
import Modal from '../shared/Modal';
import { RouteNames, ROUTES } from '../../constants/routes';
import PageTitle from '../shared/PageTitle';

function DetectorScreen(): React.ReactElement {
  const history: History = useHistory();
  const location: Location = useLocation();

  const onModalClose = (): void => {
    const path: LocationDescriptor = {
      pathname: ROUTES[RouteNames.home].path,
      search: location.search,
      hash: location.hash,
    };
    history.push(path);
  };

  return (
    <>
      <PageTitle />
      <Modal onClose={onModalClose}>
        <LinksDetector />
      </Modal>
    </>
  );
}

export default DetectorScreen;
