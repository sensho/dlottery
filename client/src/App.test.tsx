import React from 'react';
import { render, screen } from '@testing-library/react';
import Routing from './config/Routing';

test('renders learn react link', () => {
  render(<Routing />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
