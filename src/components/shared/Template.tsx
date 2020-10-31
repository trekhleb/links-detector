import React from 'react';

type TemplateProps = {
  children?: React.ReactNode,
}

function Template(props: TemplateProps): React.ReactElement {
  const { children } = props;
  return (
    <main>
      <section>
        {children}
      </section>
    </main>
  );
}

export default Template;
