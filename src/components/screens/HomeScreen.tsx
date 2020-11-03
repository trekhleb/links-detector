import React from 'react';
import { useHistory } from 'react-router-dom';
import { History } from 'history';

import { ROUTES } from '../../constants/routes';
import LaunchButton from '../shared/LaunchButton';
import Promo from '../shared/Promo';

function HomeScreen(): React.ReactElement {
  const history: History = useHistory();

  const onLaunch = (): void => {
    history.push(ROUTES.detector.path);
  };

  return (
    <div className="flex justify-center items-center flex-col flex-grow self-stretch">
      <div className="text-left self-stretch">
        <Promo />
      </div>
      <div className="flex justify-center items-center flex-col flex-grow self-stretch">
        <LaunchButton onClick={onLaunch}>
          Scan
        </LaunchButton>
      </div>
    </div>
  );
}

export default HomeScreen;
