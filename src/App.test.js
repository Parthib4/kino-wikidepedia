import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the Wikipedia search app', () => {
  render(<App />);
  expect(screen.getByText(/explore the world with kinowiki/i)).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: /search wikipedia/i })).toBeInTheDocument();
});
