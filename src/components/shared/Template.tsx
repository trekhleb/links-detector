import React from 'react';

import Header from './Header';
import Footer from './Footer';
import { FRAME_PADDING_CLASS } from '../../constants/style';

type TemplateProps = {
  children?: React.ReactNode,
}

function Template(props: TemplateProps): React.ReactElement {
  const { children } = props;
  return (
    <main className={`full-height flex flex-col ${FRAME_PADDING_CLASS}`}>
      <header className="mb-5">
        <Header />
      </header>
      <section className="flex flex-grow mb-5 justify-center items-center">
        {children}
      </section>
      <footer>
        <Footer />
      </footer>
    </main>
  );
}

export default Template;
