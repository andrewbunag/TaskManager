import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders Task Manager title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Task Manager/i);
  expect(titleElement).toBeInTheDocument();
});

test('fetches and displays tasks', async () => {
  // Arrange
  // Mock API response
  const mockTasks = [{ id: 1, title: 'Test Task', description: 'Test Description' }];
  jest.spyOn(global, 'fetch').mockResolvedValue({
    json: jest.fn().mockResolvedValue(mockTasks),
  });

  // Act
  render(<App />);

  // Assert
  const taskElement = await screen.findByText(/Test Task/i);
  expect(taskElement).toBeInTheDocument();
});
