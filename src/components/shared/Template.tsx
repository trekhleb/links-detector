import React from 'react';

interface Props {
  children: React.ReactNode,
}

const Template: React.FC<Props> = (props) => {
  const {children} = props;
  return (
    <div>
      {children}
    </div>
  );
};

export default Template;
