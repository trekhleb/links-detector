import React from 'react';
import LiveDetector from '../elements/LiveDetector';
import Modal from '../shared/Modal';

function DetectorScreen(): React.ReactElement {
  return (
    <Modal>
      <LiveDetector />
    </Modal>
  );
}

export default DetectorScreen;
