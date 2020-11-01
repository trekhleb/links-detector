import React from 'react';
import { NavLink } from 'react-router-dom';

import { ROUTES } from '../../constants/routes';

function HomeScreen(): React.ReactElement {
  return (
    <div className="flex justify-center items-center flex-col">
      <div>--Icon here--</div>
      <NavLink to={ROUTES.detector.path}>Detect Printed Links</NavLink>
    </div>
  );
}

export default HomeScreen;
