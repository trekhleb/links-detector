import React from 'react';
import {ROUTES} from '../../constants/routes';
import {NavLink} from 'react-router-dom';

function MainNavigation(): React.ReactElement {
  return (
    <ul>
      <li>
        <NavLink to={ROUTES.home.path}>Home</NavLink>
      </li>
      <li>
        <NavLink to={ROUTES.detector.path}>Detector</NavLink>
      </li>
    </ul>
  );
}

export default MainNavigation;
