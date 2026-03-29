import { render, screen } from '@testing-library/react';
import App from './App';

test('renders auth actions on home screen', async () => {
  render(<App />);
  expect(await screen.findByText(/welcome, trainer!/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
});
