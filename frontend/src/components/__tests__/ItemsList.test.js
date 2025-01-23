import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ItemsList from '../ItemsList';

global.fetch = jest.fn();

describe('ItemsList Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading indicator when fetching data', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<ItemsList />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByTestId('loading')).not.toBeInTheDocument());
  });

  test('renders error message when fetch fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Network Error'));

    render(<ItemsList />);
    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Error loading todos');
    });
  });

  test('renders todos from API', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, task: 'Test Task 1' }, { id: 2, task: 'Test Task 2' }],
    });

    render(<ItemsList />);
    await screen.findByText('Test Task 1');
    await screen.findByText('Test Task 2');
  });

  test('adds a new todo', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: 1, task: 'Existing Task' }],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: 1, task: 'Existing Task' }, { id: 2, task: 'New Task' }],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: 1, task: 'Existing Task' }, { id: 2, task: 'New Task' }],
      })
      .mockResolvedValueOnce({ ok: true });

    render(<ItemsList />);

    await screen.findByText('Existing Task');
    
    fireEvent.change(screen.getByTestId('text-todo'), { target: { value: 'New Task' } });
    fireEvent.click(screen.getByTestId('add-button'));

    await screen.findByText('New Task');
  });

  test('deletes a todo', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: 1, task: 'Task to Delete' }],
      })
      .mockResolvedValueOnce({ ok: true })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

    render(<ItemsList />);

    await screen.findByText('Task to Delete');

    fireEvent.click(screen.getByTestId('delete-button'));

    await waitFor(() => expect(screen.queryByText('Task to Delete')).not.toBeInTheDocument());
  });

  test('filters todos based on search input', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 1, task: 'Research' },
        { id: 2, task: 'Write' },
        { id: 3, task: 'Deploy' },
      ],
    });

    render(<ItemsList />);

    await waitFor(() => {
      expect(screen.getByText('Research')).toBeInTheDocument();
      expect(screen.getByText('Write')).toBeInTheDocument();
      expect(screen.getByText('Deploy')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('search todo'), { target: { value: 'Research' } });

    await waitFor(() => {
      expect(screen.getByText('Research')).toBeInTheDocument();
      expect(screen.queryByText('Write')).not.toBeInTheDocument();
      expect(screen.queryByText('Deploy')).not.toBeInTheDocument();
    });
  });
});