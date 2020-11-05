import React from 'react';

type LaunchButtonProps = {
  onClick: () => void,
  children: React.ReactNode,
};

function LaunchButton(props: LaunchButtonProps): React.ReactElement {
  const { children, onClick } = props;

  return (
    <button
      onClick={onClick}
      type="button"
      className="border-0 rounded-full text-black bg-white w-48 h-48 text-4xl"
    >
      { children }
    </button>
  );
}

export default LaunchButton;
