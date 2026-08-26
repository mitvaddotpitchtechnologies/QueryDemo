import { useMutation, useQuery, useQueryClient, } from '@tanstack/react-query';
import { NativeStackScreenProps, } from '@react-navigation/native-stack';
import {
    ActivityIndicator,
    Button,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { fetchUser, updateUser, User, UserInput, } from '../api/userApi';
import { RootStackParamList, } from '../navigation/AppNavigator';
import { useEffect, useState, } from 'react';
import { UserForm, } from './AddUserScreen';

type Props =
    NativeStackScreenProps<
        RootStackParamList,
        'EditUser'
    >;

export default function EditUserScreen({ route, navigation, }: Props) {
    const userId = route.params.userId;
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['users', userId],
        queryFn: () =>
            fetchUser(userId),
    });

    const [form, setForm,] = useState<UserInput>({
        name: '',
        username: '',
        email: '',
        phone: '',
    });

    useEffect(() => {
        if (query.data) {
            setForm({
                name: query.data.name,
                username:
                    query.data.username,
                email:
                    query.data.email,
                phone:
                    query.data.phone,
            });
        }
    }, [query.data]);

    const mutation =
        useMutation({
            mutationFn: (
                input: UserInput,
            ) =>
                updateUser(userId, input,),
            onMutate: async input => {
                await queryClient.cancelQueries({
                    queryKey: ['users', userId,],
                });
                const previous =
                    queryClient.getQueryData<User>(
                        [
                            'users',
                            userId,
                        ],
                    );
                if (previous) {
                    queryClient.setQueryData<User>(
                        ['users', userId,],
                        { ...previous, ...input, },
                    );
                }

                return {
                    previous,
                };
            },

            onError: (
                error,
                input,
                context,
            ) => {
                console.log('Update failed:', error,);
                if (context?.previous) {
                    queryClient.setQueryData(
                        ['users', userId,],
                        context.previous,
                    );
                }
            },

            onSettled: () => {
                queryClient.invalidateQueries({
                    queryKey: ['users'],
                });
            },
            onSuccess: () => {
                navigation.goBack();
            },

        });

    if (query.isPending) {

        return (
            <View style={styles.center}>

                <ActivityIndicator
                    size="large"
                    color="#e85d3f"
                />

            </View>
        );
    }

    return (
        <View style={styles.container}>

            <Text style={styles.title}>
                Edit user
            </Text>

            <UserForm
                form={form}
                setForm={setForm}
            />

            <Button
                title={
                    mutation.isPending
                        ? 'Updating...'
                        : 'Save changes'
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

const styles = StyleSheet.create({

    container: {
        backgroundColor: '#f7f8fc',
        flex: 1,
        padding: 24,
    },

    center: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },

    title: {
        color: '#16213e',
        fontSize: 30,
        fontWeight: '800',
        marginBottom: 22,
    },

    error: {
        color: '#c24737',
        marginTop: 14,
    },

});