import { fireEvent, render, screen } from '@testing-library/react-native';
import UserDetailScreen from '../../src/screens/UserDetailScreen';
import { fetchUser } from '../../src/api/userApi';
import { useQuery } from '@tanstack/react-query';

jest.mock('../../src/api/userApi', () => ({ fetchUser: jest.fn() }));
jest.mock('@tanstack/react-query', () => ({ useQuery: jest.fn() }));

const navigation = { navigate: jest.fn() };
const route = { params: { userId: 1 } } as never;
const user = {
  id: 1,
  name: 'Leanne Graham',
  username: 'Bret',
  email: 'leanne@example.com',
  phone: '123',
  website: 'example.com',
  company: { name: 'Example' },
};

describe('UserDetailScreen', () => {
  beforeEach(() => jest.clearAllMocks());

  test('shows loading and error states', () => {
    jest.mocked(useQuery).mockReturnValue({ isPending: true } as never);
    const loading = render(<UserDetailScreen navigation={navigation as never} route={route} />);
    expect(loading.UNSAFE_getByType(require('react-native').ActivityIndicator)).toBeTruthy();
    loading.unmount();

    jest.mocked(useQuery).mockReturnValue({ isPending: false, isError: true, error: new Error('Failed') } as never);
    render(<UserDetailScreen navigation={navigation as never} route={route} />);
    expect(screen.getByText('Failed')).toBeTruthy();
  });

  test('shows user details and opens edit screen', () => {
    jest.mocked(useQuery).mockReturnValue({ isPending: false, isError: false, data: user } as never);
    render(<UserDetailScreen navigation={navigation as never} route={route} />);

    expect(screen.getByText('Leanne Graham')).toBeTruthy();
    expect(screen.getByText('leanne@example.com')).toBeTruthy();
    fireEvent.press(screen.getByText('Edit user'));
    expect(navigation.navigate).toHaveBeenCalledWith('EditUser', { userId: 1 });
    expect(fetchUser).not.toHaveBeenCalled();
  });
});
