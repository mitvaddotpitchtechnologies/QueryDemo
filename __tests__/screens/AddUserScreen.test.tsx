import { fireEvent, render, screen } from '@testing-library/react-native';
import AddUserScreen from '../../src/screens/AddUserScreen';
import { createUser } from '../../src/api/userApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

jest.mock('../../src/api/userApi', () => ({ createUser: jest.fn() })); // createUser function ને mock કરે છે
jest.mock('@tanstack/react-query', () => ({ useMutation: jest.fn(), useQueryClient: jest.fn() })); // useMutation અને useQueryClient functions ને mock કરે છે

const navigation = { goBack: jest.fn() } as never;  // navigation object ને mock કરે છે
const mutate = jest.fn();  // mutate function ને mock કરે છે
const queryClient = { setQueryData: jest.fn(), invalidateQueries: jest.fn() };  // queryClient object ને mock કરે છે

describe('AddUserScreen', () => {
  beforeEach(() => {  // test run પહેલા mock functions ને clear કરે છે
    jest.clearAllMocks(); 
    jest.mocked(useQueryClient).mockReturnValue(queryClient as never);  // useQueryClient function ને mock return value આપે છે
    jest.mocked(useMutation).mockReturnValue({ mutate, isPending: false, isError: false } as never); 
  });
// render => screen ને test environment માં render કરે છે
  test('keeps create disabled until required fields are entered', () => {
    render(<AddUserScreen navigation={navigation} route={{} as never} />);
    expect(screen.getByRole('button', { name: 'Create user' })).toBeDisabled();
  });

// fireEvent.changeText => screen પર text change event fire કરે છે
// fireEvent.press => screen પર button press event fire કરે છે
// expect => screen પર element ના state ને verify કરે છે
//screen=> button, input વગેરે શોધવા માટે.

  test('submits the form', () => {   // form submit event test કરે છે
    render(<AddUserScreen navigation={navigation} route={{} as never} />);  // AddUserScreen component ને render કરે છે
    fireEvent.changeText(screen.getByPlaceholderText('Name'), 'New User'); // Name input field માં text change event fire કરે છે
    fireEvent.changeText(screen.getByPlaceholderText('Email'), 'new@example.com');
    fireEvent.press(screen.getByText('Create user')); // Create user button પર press event fire કરે છે
    expect(mutate).toHaveBeenCalledWith(expect.objectContaining({ name: 'New User', email: 'new@example.com' }));
    expect(createUser).not.toHaveBeenCalled(); // createUser function call verify કરે છે  
  });
});
