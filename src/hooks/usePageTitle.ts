import { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';

import { routeTitleFromPath } from '../utils/routes';

type UsePageTitleOutput = {
  pageTitle: string | null,
};

function usePageTitle(): UsePageTitleOutput {
  const [pageTitle, setPageTitle] = useState<string | null>(null);
  const routeMatch = useRouteMatch();

  useEffect(() => {
    const detectedPageTitle: string | null = routeTitleFromPath(routeMatch.path);
    setPageTitle(detectedPageTitle);
  }, [routeMatch.path]);

  return {
    pageTitle,
  };
}

export default usePageTitle;
