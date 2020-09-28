import React, { ErrorInfo } from 'react';
import Notification, { NotificationLevel } from './Notification';
import { buildLoggers, Loggers } from '../../utils/logger';

type ErrorBoundaryProps = {
  children: React.ReactNode,
};

type ErrorBoundaryState = {
  hasError: boolean,
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private logger: Loggers;

  constructor(props: any) {
    super(props);
    this.state = {
      hasError: false,
    };
    this.logger = buildLoggers({ context: 'ErrorBoundary' });
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.logger.logError('componentDidCatch', {
      error,
      errorInfo,
    });
  }

  render(): React.ReactNode {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <Notification level={NotificationLevel.DANGER}>
          Component has crashed
        </Notification>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
