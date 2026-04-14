import React from 'react';
import './styles.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    // Reset the state or just reload the page as a hard recovery
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="eb-wrapper">
          <div className="eb-content">
            <div className="eb-card">
              <div className="eb-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <h1 className="eb-title">Something went wrong</h1>
              <p className="eb-message">
                A cinematic disruption has occurred. We couldn't render this part of the experience.
              </p>
              <div className="eb-actions">
                <button className="eb-btn eb-btn--primary" onClick={this.handleRetry}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                    <path d="M23 4v6h-6M1 20v-6h6" />
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                  </svg>
                  Retry Now
                </button>
                <a href="/" className="eb-btn eb-btn--secondary">
                  Back to Dashboard
                </a>
              </div>
              {import.meta.env.DEV && (
                <div className="eb-debug">
                  <code>{this.state.error?.toString()}</code>
                </div>
              )}
            </div>
          </div>
          <div className="eb-mesh" />
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
