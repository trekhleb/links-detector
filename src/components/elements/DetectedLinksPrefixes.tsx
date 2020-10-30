import React, { CSSProperties } from 'react';
import { DetectionBox } from '../../utils/graphModel';
import { relativeToAbsolute } from '../../utils/image';
import Spinner from '../shared/Spinner';

type DetectedLinksPrefixesProps = {
  boxes: DetectionBox[] | null,
  containerSize: number,
};

function DetectedLinksPrefixes(props: DetectedLinksPrefixesProps): React.ReactElement | null {
  const { boxes, containerSize } = props;

  if (!boxes || !boxes.length) {
    return null;
  }

  const containerStyle: CSSProperties = {
    width: `${containerSize}px`,
    height: `${containerSize}px`,
    display: 'block',
    overflow: 'hidden',
  };

  const boxesElements = boxes.map((box: DetectionBox) => {
    const left: number = relativeToAbsolute(box.x1, containerSize);
    const top: number = relativeToAbsolute(box.y1, containerSize);
    const right: number = relativeToAbsolute(box.x2, containerSize);
    const bottom: number = relativeToAbsolute(box.y2, containerSize);
    const width: number = right - left;
    const height: number = bottom - top;
    const centerX: number = Math.floor(left + width / 2);
    const centerY: number = Math.floor(top + height / 2);

    const boxStyle: CSSProperties = {
      marginLeft: `${centerX}px`,
      marginTop: `${centerY}px`,
    };

    return (
      <div key={`${left}${top}${width}${height}`} style={boxStyle} className="block absolute">
        <Spinner />
      </div>
    );
  });

  return (
    <div style={containerStyle}>
      { boxesElements }
    </div>
  );
}

export default DetectedLinksPrefixes;
