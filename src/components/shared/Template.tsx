import React from 'react';
import MainNavigation from './MainNavigation';

type TemplateProps = {
  children?: React.ReactNode,
}

function Template(props: TemplateProps): React.ReactElement {
  const {children} = props;
  return (
    <main>
      <header>
        <nav>
          <MainNavigation />
        </nav>
      </header>
      <section>
        {children}
      </section>
      <footer />
    </main>
  );
}

export default Template;
