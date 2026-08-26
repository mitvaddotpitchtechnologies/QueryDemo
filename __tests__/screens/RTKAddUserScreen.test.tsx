import { fireEvent, render, screen } from '@testing-library/react-native';
import RTKAddUserScreen from '../../src/screens/RTKAddUserScreen';
import { useCreateRTKUserMutation } from '../../src/api/RTKUserApi';

jest.mock('../../src/api/RTKUserApi', () => ({ useCreateRTKUserMutation: jest.fn() }));

const navigation = { replace: jest.fn() } as never;
const createUser = jest.fn();

describe('RTKAddUserScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useCreateRTKUserMutation).mockReturnValue([createUser, { isLoading: false, isError: false }] as never);
  });

  test('requires name and email before creating', () => {
    render(<RTKAddUserScreen navigation={navigation} route={{} as never} />);
    expect(screen.getByRole('button', { name: 'Create User' })).toBeDisabled();
  });

  test('submits a valid user and replaces the route', () => {
    createUser.mockReturnValue({ unwrap: jest.fn().mockResolvedValue({ id: 4 }) });
    render(<RTKAddUserScreen navigation={navigation} route={{} as never} />);
    fireEvent.changeText(screen.getByPlaceholderText('Name'), 'RTK New');
    fireEvent.changeText(screen.getByPlaceholderText('Email'), 'rtk-new@example.com');
    fireEvent.press(screen.getByText('Create User'));
    expect(createUser).toHaveBeenCalledWith(expect.objectContaining({ name: 'RTK New', email: 'rtk-new@example.com' }));
  });
});
