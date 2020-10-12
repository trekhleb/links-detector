import React, { SVGProps } from 'react';

import { ReactComponent as XIcon } from './feathericons/x.svg';
import { ReactComponent as AlertCircleIcon } from './feathericons/alert-circle.svg';

export enum ICON_KEYS {
  X = 'x',
  ALERT_CIRCLE = 'alert-circle',
}

type IconType = {
  component: React.FunctionComponent<SVGProps<SVGSVGElement> & { title?: string | undefined; }>,
  fillCurrent?: boolean,
}

type IconsType = {
  [iconKey in ICON_KEYS]: IconType;
}

export const ICONS: IconsType = {
  [ICON_KEYS.X]: {
    component: XIcon,
  },
  [ICON_KEYS.ALERT_CIRCLE]: {
    component: AlertCircleIcon,
    fillCurrent: false,
  },
};
