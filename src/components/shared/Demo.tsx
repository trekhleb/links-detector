import React from 'react';

import { BASE_VIDEO_PATH } from '../../constants/routes';

function Demo(): React.ReactElement {
  const mp4DemoPath: string = `${BASE_VIDEO_PATH}/demo-black-720p.mp4`;
  const webmDemoPath: string = `${BASE_VIDEO_PATH}/demo-black-720p.webm`;

  /* eslint-disable jsx-a11y/media-has-caption */
  return (
    <video width="250" className="fade-in-5" controls={false} autoPlay loop playsInline muted>
      <source src={mp4DemoPath} type="video/mp4" />
      <source src={webmDemoPath} type="video/webm" />
      Your browser does not support the video tag.
    </video>
  );
}

export default Demo;
