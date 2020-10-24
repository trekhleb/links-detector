import React from 'react';
import { DetectedLink } from '../../hooks/useLinksDetector';

type DetectedLinksProps = {
  links: DetectedLink[],
};

function DetectedLinks(props: DetectedLinksProps): React.ReactElement | null {
  const { links } = props;

  if (!links || !links.length) {
    return null;
  }

  const linksElements = links.map((link: DetectedLink) => {
    return (
      <li key={link.url}>
        <a href={link.url}>
          {link.url}
        </a>
      </li>
    );
  });

  return (
    <div>
      Detected Links:
      <ul>
        { linksElements }
      </ul>
    </div>
  );
}

export default DetectedLinks;
