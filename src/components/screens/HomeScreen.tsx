import React from 'react';
import { useHistory } from 'react-router-dom';
import { History } from 'history';

import { ROUTES } from '../../constants/routes';
import LaunchButton from '../shared/LaunchButton';

function HomeScreen(): React.ReactElement {
  const history: History = useHistory();

  const onLaunch = (): void => {
    history.push(ROUTES.detector.path);
  };

  return (
    <div className="flex justify-center items-center flex-col">
      <LaunchButton onClick={onLaunch}>
        Scan
      </LaunchButton>
    </div>
  );
}

export default HomeScreen;
