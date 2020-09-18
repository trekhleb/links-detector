import React from 'react';

type TemplateProps = {
  children?: React.ReactNode,
}

function Template(props: TemplateProps): React.ReactElement {
  const {children} = props;
  return (
    <div>
      {children}
    </div>
  );
}

export default Template;
