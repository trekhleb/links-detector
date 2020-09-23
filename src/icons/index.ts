import React, { SVGProps } from 'react';

import { ReactComponent as XIcon } from './feathericons/x.svg';

export enum ICON_KEYS {
  X = 'x',
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
};
