import React from 'react';
import { Helmet } from 'react-helmet';

import Icon from './Icon';
import { ICON_KEYS } from '../../icons';

type ModalProps = {
  children: React.ReactNode,
  bgClass?: string,
  textClass?: string,
  onClose?: () => void,
};

function Modal(props: ModalProps): React.ReactElement {
  const {
    children,
    bgClass = 'bg-black',
    textClass = 'text-white',
    onClose = (): void => {},
  } = props;

  let modalContainerClasses = 'absolute left-0 top-0 w-full h-full overflow-hidden flex items-center justify-center flex-col';
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
        <div className="absolute left-0 top-0 m-3 bg-black rounded-full overflow-hidden">
          <button type="button" onClick={onClose} className="bg-transparent cursor-pointer border-0 p-0 m-0 focus:outline-none">
            <Icon iconKey={ICON_KEYS.X} className={`${textClass} w-8 h-8 hover:animate-pulse`} />
          </button>
        </div>
        <div>
          {children}
        </div>
      </div>
    </>
  );
}

export default Modal;
