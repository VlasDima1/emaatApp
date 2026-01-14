import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in React component tree:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-brand-light p-4 text-brand-dark">
            <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
                <h1 className="text-3xl font-bold text-rose-600 mb-2">Oops! Something went wrong.</h1>
                <p className="text-lg text-gray-600 mb-6">An unexpected error occurred in the app. Your progress has been saved.</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-brand-primary text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Reload eMaat
                </button>
            </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}

export default ErrorBoundary;