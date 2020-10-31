import React from 'react';

import MainNavigation from '../shared/MainNavigation';
import Header from '../shared/Header';
import Footer from '../shared/Footer';

function HomeScreen(): React.ReactElement {
  return (
    <div className="min-h-screen flex flex-col p-3">
      <header className="mb-3">
        <Header />
      </header>
      <section className="flex-grow mb-3">
        <MainNavigation />
      </section>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default HomeScreen;
