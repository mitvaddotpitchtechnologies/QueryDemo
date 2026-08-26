import { fireEvent, render, screen } from '@testing-library/react-native';
import { FlatList } from 'react-native';
import RTKUsersScreen from '../../src/screens/RTKUsersScreen';
import { useDeleteRTKUserMutation, useGetRTKUsersQuery } from '../../src/api/RTKUserApi';

jest.mock('../../src/api/RTKUserApi', () => ({
  useDeleteRTKUserMutation: jest.fn(),
  useGetRTKUsersQuery: jest.fn(),
}));

const navigation = { navigate: jest.fn() };
const refetch = jest.fn();
const deleteUser = jest.fn();
const users = [{
  id: 1,
  name: 'RTK User',
  email: 'rtk@example.com',
}];

describe('RTKUsersScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useDeleteRTKUserMutation).mockReturnValue([
      deleteUser,
      { isLoading: false },
    ] as never);
  });

  test('shows loading state', () => {
    jest.mocked(useGetRTKUsersQuery).mockReturnValue({ isLoading: true } as never);
    render(<RTKUsersScreen navigation={navigation as never} route={{} as never} />);
    expect(screen.getByText('Loading RTK users...')).toBeTruthy();
  });

  test('shows error state and retries', () => {
    jest.mocked(useGetRTKUsersQuery).mockReturnValue({
      isLoading: false,
      isError: true,
      refetch,
    } as never);
    render(<RTKUsersScreen navigation={navigation as never} route={{} as never} />);
    fireEvent.press(screen.getByText('Try again'));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  test('renders users, refreshes, navigates, and deletes', () => {
    jest.mocked(useGetRTKUsersQuery).mockReturnValue({
      data: users,
      isLoading: false,
      isFetching: true,
      isError: false,
      refetch,
    } as never);
    deleteUser.mockReturnValue({ unwrap: jest.fn().mockResolvedValue(undefined) });

    render(<RTKUsersScreen navigation={navigation as never} route={{} as never} />);
    fireEvent.press(screen.getByText('RTK User'));
    fireEvent.press(screen.getByText('Delete'));
    const list = screen.UNSAFE_getByType(FlatList);
    list.props.onRefresh();
    fireEvent.press(screen.getByText('+ Add'));

    expect(screen.getByText('Refreshing...')).toBeTruthy();
    expect(navigation.navigate).toHaveBeenCalledWith('RTKUserDetail', { userId: 1 });
    expect(deleteUser).toHaveBeenCalledWith(1);
    expect(refetch).toHaveBeenCalled();
    expect(navigation.navigate).toHaveBeenCalledWith('RTKAddUser');
  });
});
