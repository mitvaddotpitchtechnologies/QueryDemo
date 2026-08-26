export type User = {
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
    website: string;
    company: {
        name: string;
    };
};

export type UserInput = Pick<
    User,
    'name' | 'username' | 'email' | 'phone'
>;

const API_URL =
    'https://jsonplaceholder.typicode.com/users';

async function request<T>(
    url: string,
    options?: RequestInit,
): Promise<T> {

    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
        },
        ...options,
    });

    if (!response.ok) {
        throw new Error(
            `Request failed (${response.status})`,
        );
    }

    return response.json() as Promise<T>;
}

export const fetchUsers = () =>
    request<User[]>(API_URL);

export const fetchUser = (id: number) =>
    request<User>(`${API_URL}/${id}`);

export const createUser = (
    input: UserInput,
) =>
    request<User>(API_URL, {
        method: 'POST',
        body: JSON.stringify(input),
    });

export const updateUser = (
    id: number,
    input: UserInput,
) =>
    request<User>(`${API_URL}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
    });

export const deleteUser = (
    id: number,
) =>
    request<{}>(`${API_URL}/${id}`, {
        method: 'DELETE',
    });