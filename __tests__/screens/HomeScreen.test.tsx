import { fireEvent, render, screen } from '@testing-library/react-native';
import HomeScreen from '../../src/screens/HomeScreen';
import { useAppDispatch, useAppSelector } from '../../src/redux/hooks';
import { signOut } from '../../src/redux/store';

jest.mock('../../src/redux/hooks', () => ({
  useAppDispatch: jest.fn(),
  useAppSelector: jest.fn(),
}));
jest.mock('../../src/redux/store', () => ({ signOut: jest.fn() }));

const dispatch = jest.fn();
const navigation = { navigate: jest.fn() };

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useAppDispatch).mockReturnValue(dispatch);
    jest.mocked(useAppSelector).mockReturnValue('demo@example.com' as never);
  });

  test('shows signed-in email and query options', () => {
    render(<HomeScreen navigation={navigation as never} route={{} as never} />);

    expect(screen.getByText('demo@example.com')).toBeTruthy();
    expect(screen.getByText('TanStack Query Users')).toBeTruthy();
    expect(screen.getByText('RTK Query Users')).toBeTruthy();
  });

  test('navigates and signs out', () => {
    render(<HomeScreen navigation={navigation as never} route={{} as never} />);

    fireEvent.press(screen.getByText('TanStack Query Users'));
    fireEvent.press(screen.getByText('RTK Query Users'));
    fireEvent.press(screen.getByText('Sign out'));

    expect(navigation.navigate).toHaveBeenNthCalledWith(1, 'Users');
    expect(navigation.navigate).toHaveBeenNthCalledWith(2, 'RTKUsers');
    expect(dispatch).toHaveBeenCalledWith(signOut());
  });
});
