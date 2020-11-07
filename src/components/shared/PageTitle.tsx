import React from 'react';
import { Helmet } from 'react-helmet';

import usePageTitle from '../../hooks/usePageTitle';
import { APP_TITLE } from '../../constants/page';

function PageTitle(): React.ReactElement | null {
  const { pageTitle } = usePageTitle();

  return (
    <Helmet>
      <title>{pageTitle || APP_TITLE}</title>
    </Helmet>
  );
}

export default PageTitle;
