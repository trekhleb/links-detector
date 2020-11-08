import React from 'react';
import { useHistory } from 'react-router-dom';
import { History, LocationDescriptor } from 'history';

import LinksDetector from '../elements/LinksDetector';
import Modal from '../shared/Modal';
import { RouteNames, ROUTES } from '../../constants/routes';
import PageTitle from '../shared/PageTitle';

function DetectorScreen(): React.ReactElement {
  const history: History = useHistory();

  const onModalClose = (): void => {
    const path: LocationDescriptor = {
      pathname: ROUTES[RouteNames.home].path,
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
