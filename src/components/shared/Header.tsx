import React from 'react';

import Logo from './Logo';

function Header(): React.ReactElement {
  return (
    <header className="fade-in-5">
      <Logo />
    </header>
  );
}

export default Header;
