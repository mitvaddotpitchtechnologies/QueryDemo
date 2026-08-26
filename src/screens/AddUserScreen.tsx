import { useMutation, useQueryClient, } from '@tanstack/react-query';
import { NativeStackScreenProps, } from '@react-navigation/native-stack';
import { useState, } from 'react';
import {
    Button,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { createUser, User, UserInput, } from '../api/userApi';
import {
    RootStackParamList,
} from '../navigation/AppNavigator';

type Props =
    NativeStackScreenProps<
        RootStackParamList,
        'AddUser'
    >;

export default function AddUserScreen({ navigation, }: Props) {

    const [form, setForm,] = useState<UserInput>({
        name: '',
        username: '',
        email: '',
        phone: '',
    });
    const queryClient = useQueryClient();
    const mutation =
        useMutation({
            mutationFn: createUser,
            onSuccess: user => {
                // Add server response to cache
                queryClient.setQueryData<User[]>(
                    ['users'],
                    users =>
                        users
                            ? [...users, user]
                            : [user],
                );

                // Optional:
                // make sure server data is latest
                queryClient.invalidateQueries({
                    queryKey: ['users'],
                });
                navigation.goBack();
            },

        });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                New user
            </Text>
            <UserForm
                form={form}
                setForm={setForm}
            />
            <Button
                title={
                    mutation.isPending
                        ? 'Saving...'
                        : 'Create user'
                }
                disabled={
                    mutation.isPending ||
                    !form.name ||
                    !form.email
                }
                onPress={() =>
                    mutation.mutate(form)
                }
                color="#e85d3f"
            />

            {mutation.isError && (

                <Text style={styles.error}>
                    {mutation.error.message}
                </Text>

            )}
        </View>
    );
}

export function UserForm({
    form,
    setForm,
}: {
    form: UserInput;
    setForm: (
        value: UserInput,
    ) => void;
}) {

    const update = (
        key: keyof UserInput,
        value: string,
    ) => {

        setForm({
            ...form,
            [key]: value,
        });
    };

    return (
        <View>

            {(
                [
                    'name',
                    'username',
                    'email',
                    'phone',
                ] as const
            ).map(key => (

                <TextInput
                    key={key}
                    value={form[key]}
                    onChangeText={value =>
                        update(key, value)
                    }
                    placeholder={
                        key[0].toUpperCase() +
                        key.slice(1)
                    }
                    autoCapitalize="none"
                    style={styles.input}
                />

            ))}

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        backgroundColor: '#f7f8fc',
        flex: 1,
        padding: 24,
    },

    title: {
        color: '#16213e',
        fontSize: 30,
        fontWeight: '800',
        marginBottom: 22,
    },

    input: {
        backgroundColor: '#fff',
        borderColor: '#e1e5ee',
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 12,
        padding: 14,
    },

    error: {
        color: '#c24737',
        marginTop: 14,
    },

});