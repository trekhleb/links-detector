import React from 'react';

import Icon from './Icon';
import { ICON_KEYS } from '../../icons';

type ModalCloseButtonProps = {
  onClick: () => void,
};

function ModalCloseButton(props: ModalCloseButtonProps): React.ReactElement {
  const { onClick } = props;

  const commonClasses = 'transition duration-300 ease-in-out w-full h-full';
  const iconButtonClass = `${commonClasses} cursor-pointer border-0 p-0 m-0 rounded-full focus:outline-none bg-black hover:bg-white`;
  const iconClass = `${commonClasses} text-white hover:text-black`;

  return (
    <button
      type="button"
      onClick={onClick}
      className={iconButtonClass}
    >
      <Icon
        iconKey={ICON_KEYS.X}
        className={iconClass}
      />
    </button>
  );
}

export default ModalCloseButton;
