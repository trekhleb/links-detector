import React from 'react';

type ModalProps = {
  children: React.ReactNode,
};

function Modal(props: ModalProps): React.ReactElement {
  const {children} = props;

  return (
    <div>
      {children}
    </div>
  );
}

export default Modal;
