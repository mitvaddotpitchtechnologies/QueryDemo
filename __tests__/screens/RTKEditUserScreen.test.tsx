import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import RTKEditUserScreen from '../../src/screens/RTKEditUserScreen';
import { useGetRTKUserQuery, useUpdateRTKUserMutation } from '../../src/api/RTKUserApi';

jest.mock('../../src/api/RTKUserApi', () => ({ useGetRTKUserQuery: jest.fn(), useUpdateRTKUserMutation: jest.fn() }));

const navigation = { goBack: jest.fn() } as never;
const updateUser = jest.fn();
const user = { id: 5, name: 'RTK Old', username: 'old', email: 'old@rtk.dev', phone: '555' };

describe('RTKEditUserScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useGetRTKUserQuery).mockReturnValue({ isLoading: false, data: user } as never);
    jest.mocked(useUpdateRTKUserMutation).mockReturnValue([updateUser, { isLoading: false }] as never);
  });

  test('loads user data and submits updates', async () => {
    updateUser.mockReturnValue({ unwrap: jest.fn().mockResolvedValue({}) });
    render(<RTKEditUserScreen navigation={navigation} route={{ params: { userId: 5 } } as never} />);
    await waitFor(() => expect(screen.getByDisplayValue('RTK Old')).toBeTruthy());
    fireEvent.changeText(screen.getByDisplayValue('RTK Old'), 'RTK Updated');
    fireEvent.press(screen.getByText('Save Changes'));
    expect(updateUser).toHaveBeenCalledWith(expect.objectContaining({ id: 5, data: expect.objectContaining({ name: 'RTK Updated' }) }));
  });

  test('shows loading state', () => {
    jest.mocked(useGetRTKUserQuery).mockReturnValue({ isLoading: true } as never);
    render(<RTKEditUserScreen navigation={navigation} route={{ params: { userId: 5 } } as never} />);
    expect(screen.queryByText('RTK Edit User')).toBeNull();
  });
});
