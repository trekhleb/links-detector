import React from 'react';
import { NavLink } from 'react-router-dom';

import Header from '../shared/Header';
import Footer from '../shared/Footer';
import { ROUTES } from '../../constants/routes';

function HomeScreen(): React.ReactElement {
  return (
    <div className="full-height flex flex-col p-5">
      <header className="mb-5">
        <Header />
      </header>
      <section className="flex flex-grow mb-5 justify-center items-center">
        <div className="flex justify-center items-center flex-col">
          <div>--Icon here--</div>
          <NavLink to={ROUTES.detector.path}>Detect Printed Links</NavLink>
        </div>
      </section>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default HomeScreen;
