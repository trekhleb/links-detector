import React, { CSSProperties } from 'react';

import Header from './Header';
import Footer from './Footer';
import { FRAME_PADDING_CLASS } from '../../constants/style';

type TemplateProps = {
  children?: React.ReactNode,
}

function Template(props: TemplateProps): React.ReactElement {
  const { children } = props;

  const headerStyles: CSSProperties = {
    zIndex: 1,
  };

  const footerStyles: CSSProperties = {
    zIndex: 1,
  };

  return (
    <main className={`full-height flex flex-col ${FRAME_PADDING_CLASS}`}>
      <header style={headerStyles} className="mb-5">
        <Header />
      </header>
      <section className="flex flex-row flex-grow mb-5 justify-center items-center">
        {children}
      </section>
      <footer style={footerStyles}>
        <Footer />
      </footer>
    </main>
  );
}

export default Template;
