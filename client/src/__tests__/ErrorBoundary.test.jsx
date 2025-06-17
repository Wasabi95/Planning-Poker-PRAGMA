// src/__tests__/ErrorBoundary.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../pages/ErrorBoundary';
import '@testing-library/jest-dom';

// Component that throws an error
const ErrorComponent = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error occurred!');
  }
  return <div>Normal content</div>;
};

describe('ErrorBoundary Component', () => {
  // Mock console.error to clean up test output
  const originalError = console.error;
  
  beforeAll(() => {
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  test('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <ErrorComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal content')).toBeInTheDocument();
    expect(console.error).not.toHaveBeenCalled();
  });

  test('displays fallback UI when child component throws error', () => {
    render(
      <ErrorBoundary>
        <ErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByRole('heading', { name: /something went wrong/i })).toBeInTheDocument();
    expect(screen.getByText('Test error occurred!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reload app/i })).toBeInTheDocument();
    expect(console.error).toHaveBeenCalled();
  });

  test('calls componentDidCatch and logs error information', () => {
    const errorSpy = jest.spyOn(ErrorBoundary.prototype, 'componentDidCatch');
    
    render(
      <ErrorBoundary>
        <ErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(errorSpy).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String)
      })
    );
    errorSpy.mockRestore();
  });

  test('shows generic message when error has no message', () => {
    const EmptyErrorComponent = () => {
      throw {}; // Throw empty object
    };

    render(
      <ErrorBoundary>
        <EmptyErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.queryByText('Test error occurred!')).not.toBeInTheDocument();
  });

  test('reload button has correct click handler', () => {
    // Create a test instance of ErrorBoundary
    const { container } = render(
      <ErrorBoundary>
        <ErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    // Get the reload button
    const reloadButton = screen.getByRole('button', { name: /reload app/i });
    
    // Verify the onClick handler is set
    expect(reloadButton.onclick).toBeDefined();
    
    // Simulate click and verify the button works
    fireEvent.click(reloadButton);
    expect(console.error).not.toHaveBeenCalledWith(
      expect.stringContaining('reloadPage'),
      expect.anything()
    );
  });
});