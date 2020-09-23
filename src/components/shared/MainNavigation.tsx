import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

function MainNavigation(): React.ReactElement {
  return (
    <ul>
      <li>
        <NavLink to={ROUTES.detector.path}>Detector</NavLink>
      </li>
    </ul>
  );
}

export default MainNavigation;
