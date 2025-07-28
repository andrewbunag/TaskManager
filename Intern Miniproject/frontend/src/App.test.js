import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders Task Manager title', () => {
    render(<App />);
    const titleElement = screen.getByText(/Task Manager/i);
    expect(titleElement).toBeInTheDocument();
});

test('adds a new task', () => {
    render(<App />);
    const titleInput = screen.getByPlaceholderText(/Title/i);
    const descriptionInput = screen.getByPlaceholderText(/Description/i);
    const addButton = screen.getByText(/Add Task/i);

    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.click(addButton);

    const taskElement = screen.getByText(/Test Task - Test Description/i);
    expect(taskElement).toBeInTheDocument();
});
