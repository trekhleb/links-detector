import React, { CSSProperties } from 'react';
import { DetectedLink } from '../../hooks/useLinksDetector';
import Icon from '../shared/Icon';
import { ICON_KEYS } from '../../icons';

type DetectedLinksProps = {
  links: DetectedLink[],
  containerSize: number,
};

function DetectedLinks(props: DetectedLinksProps): React.ReactElement | null {
  const { links, containerSize } = props;

  if (!links || !links.length) {
    return null;
  }

  const containerStyle: CSSProperties = {
    width: `${containerSize}px`,
    height: `${containerSize}px`,
  };

  const linkStyle: CSSProperties = {
    backgroundColor: 'black',
    fontSize: '12px',
  };

  const linksElements = links.map((link: DetectedLink) => {
    const linkContainerStyle: CSSProperties = {
      marginTop: `${link.y1}px`,
      marginLeft: `${link.x1}px`,
    };

    return (
      <div key={link.url} style={linkContainerStyle} className="absolute block overflow-hidden">
        <a href={link.url} style={linkStyle} className="text-white flex flex-row items-start justify-center p-3">
          <Icon iconKey={ICON_KEYS.LINK} className="w-4 h-4 mr-2" />
          <span>{link.url}</span>
        </a>
      </div>
    );
  });

  return (
    <div style={containerStyle} className="block overflow-hidden">
      { linksElements }
    </div>
  );
}

export default DetectedLinks;
