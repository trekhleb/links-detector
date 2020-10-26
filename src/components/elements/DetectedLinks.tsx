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
    display: 'block',
    overflow: 'hidden',
  };

  const linkStyle: CSSProperties = {
    color: 'white',
    backgroundColor: 'black',
    padding: '3px 6px',
    fontSize: '12px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const linksElements = links.map((link: DetectedLink) => {
    const linkContainerStyle: CSSProperties = {
      overflow: 'hidden',
      position: 'absolute',
      display: 'block',
      marginLeft: `${link.x1}px`,
      marginTop: `${link.y1}px`,
      // width: `${link.x2 - link.x1}px`,
      // height: `${link.y2 - link.y1}px`,
      backgroundColor: 'rgba(0, 255, 255, 0.1)',
    };

    return (
      <div key={link.url} style={linkContainerStyle}>
        <a href={link.url} style={linkStyle}>
          <Icon iconKey={ICON_KEYS.LINK} className="w-4 h-4 mr-2" />
          <span>{link.url}</span>
        </a>
      </div>
    );
  });

  return (
    <div style={containerStyle}>
      { linksElements }
    </div>
  );
}

export default DetectedLinks;
