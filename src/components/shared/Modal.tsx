import React from 'react';
import { Helmet } from 'react-helmet';

type ModalProps = {
  children: React.ReactNode,
  bgColorClass?: string,
};

function Modal(props: ModalProps): React.ReactElement {
  const { children, bgColorClass = 'bg-black' } = props;

  const modalContainerClasses = `${bgColorClass} absolute left-0 top-0 w-full h-full overflow-hidden flex items-center justify-center flex-col`;

  return (
    <div className={modalContainerClasses}>
      <Helmet bodyAttributes={{ class: `${bgColorClass}` }} />
      {children}
    </div>
  );
}

export default Modal;
