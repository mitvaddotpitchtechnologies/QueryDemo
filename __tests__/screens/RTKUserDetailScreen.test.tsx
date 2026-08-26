import { fireEvent, render, screen } from '@testing-library/react-native';
import RTKUserDetailScreen from '../../src/screens/RTKUserDetailScreen';
import { useGetRTKUserQuery } from '../../src/api/RTKUserApi';

jest.mock('../../src/api/RTKUserApi', () => ({ useGetRTKUserQuery: jest.fn() }));

const navigation = { navigate: jest.fn() };
const route = { params: { userId: 3 } } as never;
const user = { id: 3, name: 'RTK User', username: 'rtk', email: 'rtk@example.com', phone: '321', website: 'rtk.dev', company: { name: 'RTK Co' } };

describe('RTKUserDetailScreen', () => {
  beforeEach(() => jest.clearAllMocks());

  test('shows loading and error states', () => {
    jest.mocked(useGetRTKUserQuery).mockReturnValue({ isLoading: true } as never);
    const loading = render(<RTKUserDetailScreen navigation={navigation as never} route={route} />);
    expect(loading.getByTestId).toBeDefined();
    loading.unmount();
    jest.mocked(useGetRTKUserQuery).mockReturnValue({ isLoading: false, isError: true, error: new Error('Failed') } as never);
    render(<RTKUserDetailScreen navigation={navigation as never} route={route} />);
    expect(screen.getByText('Failed to load user')).toBeTruthy();
  });

  test('renders user and navigates to edit', () => {
    jest.mocked(useGetRTKUserQuery).mockReturnValue({ isLoading: false, isError: false, data: user } as never);
    render(<RTKUserDetailScreen navigation={navigation as never} route={route} />);
    fireEvent.press(screen.getByText('Edit User'));
    expect(screen.getByText('RTK User')).toBeTruthy();
    expect(navigation.navigate).toHaveBeenCalledWith('RTKEditUser', { userId: 3 });
  });
});
