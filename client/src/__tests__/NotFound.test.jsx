//src/pages/__tests__/NotFound.test.jsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotFound from '../pages/NotFound';

describe('NotFound Page', () => {
  it('renders 404 page with heading and link', () => {
    render(
      <BrowserRouter>
        <NotFound />
      </BrowserRouter>
    );

    // Check the 404 heading
    expect(screen.getByText('404')).toBeInTheDocument();

    // Check the 'Page not found' message
    expect(screen.getByText('Page not found')).toBeInTheDocument();

    // Check the 'Return to Home' link
    expect(screen.getByRole('link', { name: /return to home/i })).toBeInTheDocument();
  });
});
