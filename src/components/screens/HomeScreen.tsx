import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { History, PartialPath, Location } from 'history';

import { ROUTES } from '../../constants/routes';
import LaunchButton from '../shared/LaunchButton';
import Promo from '../shared/Promo';

function HomeScreen(): React.ReactElement {
  const history: History = useHistory();
  const location: Location = useLocation();

  const onLaunch = (): void => {
    const path: PartialPath = {
      pathname: ROUTES.detector.path,
      search: location.search,
      hash: location.hash,
    };
    history.push(path);
  };

  return (
    <div className="flex justify-center items-center flex-col flex-grow self-stretch">
      <div className="text-left self-stretch">
        <Promo />
      </div>
      <div className="flex justify-center items-center flex-col flex-grow self-stretch">
        <LaunchButton onClick={onLaunch}>
          scan
        </LaunchButton>
      </div>
    </div>
  );
}

export default HomeScreen;
