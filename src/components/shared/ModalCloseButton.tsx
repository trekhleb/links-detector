import React from 'react';

import Icon from './Icon';
import { ICON_KEYS } from '../../icons';

type ModalCloseButtonProps = {
  onClick: () => void,
};

function ModalCloseButton(props: ModalCloseButtonProps): React.ReactElement {
  const { onClick } = props;

  const iconButtonClass = 'w-8 h-8 bg-transparent cursor-pointer border-0 p-0 m-0 focus:outline-none';
  const iconClass = 'transition duration-300 ease-in-out w-8 h-8 text-white hover:text-black';

  return (
    <button
      type="button"
      onClick={onClick}
      className={iconButtonClass}
    >
      <Icon iconKey={ICON_KEYS.X} className={iconClass} />
    </button>
  );
}

export default ModalCloseButton;
