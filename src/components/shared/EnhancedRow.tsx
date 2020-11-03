import React from 'react';

type EnhancedRowProps = {
  content: React.ReactNode,
  contentClassName?: string,
  className?: string,
  startEnhancer?: React.ReactNode,
};

function EnhancedRow(props: EnhancedRowProps): React.ReactElement {
  const {
    startEnhancer,
    content,
    contentClassName = '',
    className = '',
  } = props;

  const startEnhancerElement = startEnhancer ? (
    <div>
      {startEnhancer}
    </div>
  ) : null;

  const contentElement = (
    <div className={`flex-grow ${contentClassName}`}>
      {content}
    </div>
  );

  return (
    <div className={`flex flex-row justify-center items-center ${className}`}>
      {startEnhancerElement}
      {contentElement}
    </div>
  );
}

export default EnhancedRow;
