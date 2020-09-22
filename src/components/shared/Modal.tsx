import React from 'react';

type ModalProps = {
  children: React.ReactNode,
};

function Modal(props: ModalProps): React.ReactElement {
  const { children } = props;

  const bgColor: string = 'bg-black';
  const modalContainerClasses = `${bgColor} absolute left-0 top-0 w-full h-full overflow-hidden flex items-center justify-center flex-col`;

  return (
    <div className={modalContainerClasses}>
      {children}
    </div>
  );
}

export default Modal;
