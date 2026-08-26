import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import EditUserScreen from '../../src/screens/EditUserScreen';
import { fetchUser, updateUser } from '../../src/api/userApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

jest.mock('../../src/api/userApi', () => ({ fetchUser: jest.fn(), updateUser: jest.fn() }));
jest.mock('@tanstack/react-query', () => ({ useMutation: jest.fn(), useQuery: jest.fn(), useQueryClient: jest.fn() }));

const navigation = { goBack: jest.fn() } as never;
const queryClient = { cancelQueries: jest.fn(), getQueryData: jest.fn(), setQueryData: jest.fn(), invalidateQueries: jest.fn() };
const mutate = jest.fn();
const user = { id: 1, name: 'Old User', username: 'old', email: 'old@example.com', phone: '123' };

describe('EditUserScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useQueryClient).mockReturnValue(queryClient as never);
    jest.mocked(useQuery).mockReturnValue({ isPending: false, data: user } as never);
    jest.mocked(useMutation).mockReturnValue({ mutate, isPending: false, isError: false } as never);
  });

  test('loads existing user data and saves changes', async () => {
    render(<EditUserScreen navigation={navigation} route={{ params: { userId: 1 } } as never} />);
    const nameInput = screen.getByPlaceholderText('Name');
    await waitFor(() => expect(nameInput.props.value).toBe('Old User'));
    fireEvent.changeText(nameInput, 'Updated User');
    fireEvent.press(screen.getByText('Save changes'));
    expect(mutate).toHaveBeenCalledWith(expect.objectContaining({ name: 'Updated User' }));
    expect(fetchUser).not.toHaveBeenCalled();
    expect(updateUser).not.toHaveBeenCalled();
  });

  test('shows loading state', () => {
    jest.mocked(useQuery).mockReturnValue({ isPending: true } as never);
    render(<EditUserScreen navigation={navigation} route={{ params: { userId: 1 } } as never} />);
    expect(screen.queryByText('Edit user')).toBeNull();
  });
});
