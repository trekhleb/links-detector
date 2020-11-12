import React, { CSSProperties } from 'react';
import { DetectionBox } from '../../utils/graphModel';
import { relativeToAbsolute } from '../../utils/image';
import Spinner from '../shared/Spinner';
import { DETECTION_CONFIG } from '../../configs/detectionConfig';

type DetectedLinksPrefixesProps = {
  boxes: DetectionBox[] | null,
  containerSize: number,
};

function DetectedLinksPrefixes(props: DetectedLinksPrefixesProps): React.ReactElement | null {
  const { boxes, containerSize } = props;

  if (!boxes || !boxes.length) {
    return null;
  }

  const regionProposalPadding: number = Math.ceil(
    containerSize * DETECTION_CONFIG.ocr.regionProposalPadding,
  );

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

    const horizontalScaleFactor: number = 10;

    const boxStyle: CSSProperties = {
      marginLeft: `${left - regionProposalPadding}px`,
      marginTop: `${top}px`,
      width: `${horizontalScaleFactor * Math.max(width, height)}px`,
      height: `${height}px`,
    };

    return (
      <div
        key={`${left}${top}${width}${height}`}
        style={boxStyle}
        className="flex flex-row justify-start items-start absolute"
      >
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
