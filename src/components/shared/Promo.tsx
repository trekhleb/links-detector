import React from 'react';

import EnhancedRow from './EnhancedRow';
import Icon from './Icon';
import { ICON_KEYS } from '../../icons';

function Promo(): React.ReactElement {
  const iconClassName: string = 'w-4 h-4';
  const textClassName: string = 'text-sm ml-2';

  return (
    <div className="flex flex-col">
      <EnhancedRow
        startEnhancer={<Icon iconKey={ICON_KEYS.BOOK_OPEN} className={iconClassName} />}
        content={<div className={textClassName}>You read a printed book</div>}
      />
      <EnhancedRow
        startEnhancer={<Icon iconKey={ICON_KEYS.LINK_2} className={iconClassName} />}
        content={<div className={textClassName}>You see a link but you can&apos;t click it</div>}
      />
      <EnhancedRow
        startEnhancer={<Icon iconKey={ICON_KEYS.SEARCH} className={iconClassName} />}
        content={<div className={textClassName}>You press the Scan</div>}
      />
      <EnhancedRow
        startEnhancer={<Icon iconKey={ICON_KEYS.SMARTPHONE} className={iconClassName} />}
        content={<div className={textClassName}>No typing, just one click and link is opened</div>}
      />
    </div>
  );
}

export default Promo;
