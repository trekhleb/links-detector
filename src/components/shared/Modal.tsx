import React from 'react';

type ModalProps = {
  children: React.ReactNode,
};

function Modal(props: ModalProps): React.ReactElement {
  const { children } = props;

  return (
    <div className="absolute left-0 top-0 w-screen h-screen overflow-hidden bg-white">
      {children}
    </div>
  );
}

export default Modal;
