// components/states/StateView.tsx
import React, { type ReactNode } from 'react';
import { Skeleton } from '../Loaders/Skeleton';
import {
  ConnectionState,
  EmptyState,
  ErrorState,
} from './FeedbackStates';

export type ViewState =
  | { status: 'loading' }
  | {
      status: 'empty';
      title?: string;
      description?: string;
      actionLabel?: string;
      onAction?: () => void;
    }
  | { status: 'error'; message?: string; onRetry: () => void }
  | { status: 'offline'; onRetry?: () => void }
  | { status: 'success' };

type StateViewProps = {
  state: ViewState;
  children: ReactNode;
  loadingFallback?: ReactNode;
};

export function StateView({
  state,
  children,
  loadingFallback,
}: StateViewProps) {
  switch (state.status) {
    case 'loading':
      return <>{loadingFallback ?? <Skeleton />}</>;

    case 'empty':
      return (
        <EmptyState
          title={state.title}
          description={state.description}
          actionLabel={state.actionLabel}
          onAction={state.onAction}
        />
      );

    case 'error':
      return (
        <ErrorState message={state.message} onRetry={state.onRetry} />
      );

    case 'offline':
      return <ConnectionState onRetry={state.onRetry} />;

    case 'success':
      return <>{children}</>;
  }
}