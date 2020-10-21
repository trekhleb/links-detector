import React from 'react';
import { ZeroOneRange } from '../../utils/types';

type ProgressBarProps = {
  progress?: ZeroOneRange | null,
  text?: string | null,
};

const progressAnimationTimeS = 0.5;

function ProgressBar(props: ProgressBarProps): React.ReactElement {
  const { progress, text } = props;

  const progressPercentage = progress !== undefined && progress !== null
    ? Math.max(Math.min(Math.floor(progress * 100), 100), 0)
    : 0;

  const progressLine = progressPercentage !== undefined && progressPercentage !== null ? (
    <div className="w-full h-1 bg-gray-800 mb-4">
      <div
        className="h-full bg-white transition duration-500 ease-in-out rounded"
        style={{ width: `${progressPercentage}%`, transition: `width ${progressAnimationTimeS}s` }}
      />
    </div>
  ) : null;

  const progressText = text ? (
    <div className="text-white animate-pulse text-xs rounded">
      {text}
    </div>
  ) : null;

  return (
    <div className="flex flex-col justify-center items-center w-full">
      {progressLine}
      {progressText}
    </div>
  );
}

export default ProgressBar;
