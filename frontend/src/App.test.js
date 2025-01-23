import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Header', () => {
  render(<App />);
  const linkElement = screen.getByText('Matt:');
  expect(linkElement).toBeInTheDocument();
});
