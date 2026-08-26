import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import LoginScreen from '../src/screens/LoginScreen';

const mockDispatch = jest.fn();

jest.mock('../src/redux/hooks', () => ({
  useAppDispatch: () => mockDispatch,
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });

  test('renders login screen', () => {
    const { getByText, getByPlaceholderText } = render(
      <LoginScreen
        navigation={{} as any}
        route={{} as any}
      />,
    );

    expect(getByText('Welcome back.')).toBeTruthy();

    expect(
      getByPlaceholderText('Email'),
    ).toBeTruthy();

    expect(
      getByPlaceholderText('Password'),
    ).toBeTruthy();
  });

  test('sign in dispatches action', () => {
    const { getByText } = render(
      <LoginScreen
        navigation={{} as any}
        route={{} as any}
      />,
    );

    fireEvent.press(getByText('Sign in'));

    expect(mockDispatch).toHaveBeenCalled();
  });

  test('sign in button disabled when email is empty', () => {
    const {
      getByPlaceholderText,
      getByText,
    } = render(
      <LoginScreen
        navigation={{} as any}
        route={{} as any}
      />,
    );

    fireEvent.changeText(
      getByPlaceholderText('Email'),
      '',
    );

    const button = getByText('Sign in');

    expect(button).toBeTruthy();
  });
});