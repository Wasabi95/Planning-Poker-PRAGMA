import React, { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="alert alert-danger p-4">
          <h1 className="h4 fw-bold">Something went wrong</h1>
          <p>{this.state.error?.message}</p>
          <button 
            className="btn btn-danger mt-3"
            onClick={() => window.location.reload()}
          >
            Reload App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
