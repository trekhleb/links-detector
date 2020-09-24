import React from 'react';
import { Helmet } from 'react-helmet';

import ModalCloseButton from './ModalCloseButton';

type ModalProps = {
  children: React.ReactNode,
  onClose?: () => void,
};

function Modal(props: ModalProps): React.ReactElement {
  const {
    children,
    onClose = (): void => {},
  } = props;

  const bgClass = 'bg-black';

  const iconContainerClass = 'transition duration-300 ease-in-out w-8 h-8 absolute right-0 top-0 m-3 bg-black rounded-full overflow-hidden z-20 hover:bg-white';

  let modalContainerClasses = 'absolute left-0 top-0 z-10 w-full h-full overflow-hidden flex items-center justify-center flex-col';
  if (bgClass) {
    modalContainerClasses += ` ${bgClass}`;
  }

  const helmet = bgClass ? (
    <Helmet bodyAttributes={{ class: `${bgClass}` }} />
  ) : null;

  return (
    <>
      {helmet}
      <div className={modalContainerClasses}>
        <div className={iconContainerClass}>
          <ModalCloseButton onClick={onClose} />
        </div>
        <div>
          {children}
        </div>
      </div>
    </>
  );
}

export default Modal;
