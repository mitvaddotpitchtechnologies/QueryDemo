import {
  fetchUsers,
  fetchUser,
  createUser,
  updateUser,
  deleteUser,
} from '../src/api/userApi';

describe('userApi', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('fetchUsers returns users', async () => {
    const users = [
      {
        id: 1,
        name: 'Test User',
      },
    ];

    jest.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => users,
    } as Response);

    await expect(fetchUsers()).resolves.toEqual(users);
  });

  test('fetchUser returns single user', async () => {
    const user = {
      id: 1,
      name: 'Test User',
    };

    jest.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => user,
    } as Response);

    await expect(fetchUser(1)).resolves.toEqual(user);

    expect(fetch).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/users/1',
      expect.anything(),
    );
  });

  test('createUser sends POST request', async () => {
    const input = {
      name: 'New User',
      username: 'new-user',
      email: 'new@example.com',
      phone: '123456789',
    };

    jest.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 2,
        ...input,
      }),
    } as Response);

    await createUser(input);

    expect(fetch).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/users',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(input),
      }),
    );
  });

  test('updateUser sends PATCH request', async () => {
    const input = {
      name: 'Updated User',
      username: 'updated',
      email: 'updated@example.com',
      phone: '999999999',
    };

    jest.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 1,
        ...input,
      }),
    } as Response);

    await updateUser(1, input);

    expect(fetch).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/users/1',
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify(input),
      }),
    );
  });

  test('deleteUser sends DELETE request', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({}),
    } as Response);

    await deleteUser(7);

    expect(fetch).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/users/7',
      expect.objectContaining({
        method: 'DELETE',
      }),
    );
  });

  test('throws error when API fails', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    await expect(fetchUsers()).rejects.toThrow(
      'Request failed (500)',
    );
  });
});