// src/api/RTKUserApi.ts

import {
    createApi,
    fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';

export type RTKUser = {
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

export type RTKUserInput = Pick<
    RTKUser,
    'name' | 'username' | 'email' | 'phone'
>;

export const RTKUserApi = createApi({

    reducerPath: 'RTKUserApi',

    baseQuery: fetchBaseQuery({
        baseUrl:
            'https://jsonplaceholder.typicode.com/',
    }),

    tagTypes: ['RTKUser'],

    endpoints: builder => ({

        // =====================================
        // GET ALL USERS
        // =====================================

        getRTKUsers: builder.query<
            RTKUser[],
            void
        >({
            query: () => 'users',
            providesTags: result =>
                result
                    ? [
                        ...result.map(user => ({
                            type: 'RTKUser' as const,
                            id: user.id,
                        })),

                        {
                            type: 'RTKUser' as const,
                            id: 'LIST',
                        },
                    ]
                    : [
                        {
                            type: 'RTKUser' as const,
                            id: 'LIST',
                        },
                    ],
        }),

        // =====================================
        // GET SINGLE USER
        // =====================================

        getRTKUser: builder.query<
            RTKUser,
            number
        >({

            query: id => `users/${id}`,

            providesTags: (
                result,
                error,
                id,
            ) => [
                    {
                        type: 'RTKUser',
                        id,
                    },
                ],
        }),
        createRTKUser:
            builder.mutation<
                RTKUser,
                RTKUserInput
            >({
                query: user => ({
                    url: 'users',
                    method: 'POST',
                    body: user,
                }),

                invalidatesTags: [
                    {
                        type: 'RTKUser',
                        id: 'LIST',
                    },
                ],
            }),
        updateRTKUser:
            builder.mutation<
                RTKUser,
                {
                    id: number;
                    data: RTKUserInput;
                }
            >({

                query: ({ id, data }) => ({
                    url: `users/${id}`,
                    method: 'PATCH',
                    body: data,
                }),

                invalidatesTags: (
                    result,
                    error,
                    { id },
                ) => [
                        {
                            type: 'RTKUser',
                            id,
                        },

                        {
                            type: 'RTKUser',
                            id: 'LIST',
                        },

                    ],
            }),

        deleteRTKUser:
            builder.mutation<
                void,
                number
            >({
                query: id => ({
                    url: `users/${id}`,
                    method: 'DELETE',
                }),

                invalidatesTags: (
                    result,
                    error,
                    id,
                ) => [
                        {
                            type: 'RTKUser',
                            id,
                        },
                        {
                            type: 'RTKUser',
                            id: 'LIST',
                        },

                    ],
            }),

    }),
});

export const {
    useGetRTKUsersQuery,
    useGetRTKUserQuery,
    useCreateRTKUserMutation,
    useUpdateRTKUserMutation,
    useDeleteRTKUserMutation,
} = RTKUserApi;