import React, {
  SyntheticEvent,
  useState,
} from 'react';

import { BASE_VIDEO_PATH } from '../../constants/routes';
import useLogger from '../../hooks/useLogger';
import Notification, { NotificationLevel } from './Notification';

const mp4DemoPath: string = `${BASE_VIDEO_PATH}/demo-black-720p.mp4`;
const webmDemoPath: string = `${BASE_VIDEO_PATH}/demo-black-720p.webm`;

function Demo(): React.ReactElement {
  const logger = useLogger({ context: 'Demo' });
  const [videoError, setVideoError] = useState<string | null>(null);

  const onVideoError = (event: SyntheticEvent<HTMLVideoElement>): void => {
    const errorMessage: string = 'Video cannot be loaded';
    setVideoError(errorMessage);
    logger.logError(errorMessage, { event });
  };

  if (videoError) {
    return (
      <Notification level={NotificationLevel.DANGER}>
        {videoError}
      </Notification>
    );
  }
  /* eslint-disable jsx-a11y/media-has-caption */
  return (
    <video
      width="250"
      className="fade-in-5"
      controls={false}
      autoPlay
      loop
      playsInline
      muted
      onError={onVideoError}
    >
      <source src={mp4DemoPath} type="video/mp4" />
      <source src={webmDemoPath} type="video/webm" />
      Your browser does not support the video tag.
    </video>
  );
}

export default Demo;
