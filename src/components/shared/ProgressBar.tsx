import React from 'react';

type ProgressBarProps = {
  progress?: number,
  text?: string,
};

function ProgressBar(props: ProgressBarProps): React.ReactElement {
  const { progress, text } = props;

  const progressPercentage = progress !== undefined
    ? Math.max(Math.min(Math.floor(progress), 100), 0)
    : undefined;

  const progressLine = progressPercentage !== undefined ? (
    <div className="w-full h-1 bg-gray-800 mb-4">
      <div
        className="h-full bg-white transition duration-300 ease-in-out rounded"
        style={{ width: `${progressPercentage}%` }}
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
