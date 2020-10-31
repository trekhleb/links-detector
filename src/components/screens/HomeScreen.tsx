import React from 'react';

import MainNavigation from '../shared/MainNavigation';
import Header from '../shared/Header';
import Footer from '../shared/Footer';

function HomeScreen(): React.ReactElement {
  return (
    <div className="bg-red-400">
      <header>
        <Header />
      </header>
      <section>
        <MainNavigation />
      </section>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default HomeScreen;
