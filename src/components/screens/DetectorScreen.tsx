import React from 'react';
import { useHistory } from 'react-router-dom';
import { PartialPath } from 'history';

import LinksDetector from '../elements/LinksDetector';
import Modal from '../shared/Modal';
import { RouteNames, ROUTES } from '../../constants/routes';
import PageTitle from '../shared/PageTitle';

function DetectorScreen(): React.ReactElement {
  const history = useHistory();

  const onModalClose = (): void => {
    const path: PartialPath = {
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
