import { fireEvent, render, screen } from '@testing-library/react-native';
import UsersScreen from '../../src/screens/UsersScreen';
import { deleteUser, fetchUsers } from '../../src/api/userApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

jest.mock('../../src/api/userApi', () => ({
  deleteUser: jest.fn(),
  fetchUsers: jest.fn(),
}));
jest.mock('@tanstack/react-query', () => ({
  useMutation: jest.fn(),
  useQuery: jest.fn(),
  useQueryClient: jest.fn(),
}));

const navigation = { navigate: jest.fn() };
const queryClient = {
  cancelQueries: jest.fn(),
  getQueryData: jest.fn(),
  setQueryData: jest.fn(),
  invalidateQueries: jest.fn(),
};
const mutate = jest.fn();

const users = [{
  id: 1,
  name: 'Leanne Graham',
  username: 'Bret',
  email: 'leanne@example.com',
  phone: '123',
  website: 'example.com',
  company: { name: 'Example' },
}];

describe('UsersScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useQueryClient).mockReturnValue(queryClient as never);
    jest.mocked(useMutation).mockReturnValue({ mutate, isPending: false } as never);
  });

  test('shows loading state', () => {
    jest.mocked(useQuery).mockReturnValue({ isPending: true } as never);
    render(<UsersScreen navigation={navigation as never} route={{} as never} />);
    expect(screen.getByText('Loading users...')).toBeTruthy();
  });

  test('shows an API error and retries', () => {
    const refetch = jest.fn();
    jest.mocked(useQuery).mockReturnValue({
      isPending: false,
      isError: true,
      error: new Error('Network unavailable'),
      refetch,
    } as never);

    render(<UsersScreen navigation={navigation as never} route={{} as never} />);
    fireEvent.press(screen.getByText('Try again'));

    expect(screen.getByText('Network unavailable')).toBeTruthy();
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  test('shows refreshing state while refetching', () => {
    jest.mocked(useQuery).mockReturnValue({
      data: [],
      isPending: false,
      isError: false,
      isRefetching: true,
      refetch: jest.fn(),
    } as never);

    render(<UsersScreen navigation={navigation as never} route={{} as never} />);
    expect(screen.getByText('0 cached records')).toBeTruthy();
  });

  test('renders users and supports navigation and delete', () => {
    jest.mocked(useQuery).mockReturnValue({
      data: users,
      isPending: false,
      isError: false,
      isRefetching: false,
      refetch: jest.fn(),
    } as never);

    render(<UsersScreen navigation={navigation as never} route={{} as never} />);

    fireEvent.press(screen.getByText('Leanne Graham'));
    fireEvent.press(screen.getByText('Delete'));
    fireEvent.press(screen.getByText('+ Add'));

    expect(navigation.navigate).toHaveBeenCalledWith('UserDetail', { userId: 1 });
    expect(mutate).toHaveBeenCalledWith(1);
    expect(navigation.navigate).toHaveBeenCalledWith('AddUser');
    expect(fetchUsers).not.toHaveBeenCalled();
    expect(deleteUser).not.toHaveBeenCalled();
  });
});
