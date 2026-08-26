import { useMutation, useQuery, useQueryClient, } from '@tanstack/react-query';

import { NativeStackScreenProps, } from '@react-navigation/native-stack';

import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { deleteUser, fetchUsers, User, } from '../api/userApi';
import { RootStackParamList, } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Users'>;

export default function UsersScreen({ navigation, }: Props) {

    const queryClient = useQueryClient();
    const usersQuery = useQuery({ queryKey: ['users'], queryFn: fetchUsers, });

    const deleteMutation =
        useMutation({
            mutationFn: deleteUser,
            onMutate: async id => {
                // Stop currently running users request
                await queryClient.cancelQueries({
                    queryKey: ['users'],
                });

                // Save previous data
                const previous = queryClient.getQueryData<User[]>(['users',]);

                // Immediately remove from UI
                queryClient.setQueryData<User[]>(
                    ['users'],
                    users =>
                        users?.filter(
                            user => user.id !== id,
                        ),
                );

                // Return previous data
                // for rollback
                return {
                    previous,
                };
            },

            onError: (
                error,
                id,
                context,
            ) => {
                console.log('Delete failed:', error);

                if (context?.previous) {
                    queryClient.setQueryData(
                        ['users'],
                        context.previous,
                    );
                }
            },

            onSettled: () => {
                queryClient.invalidateQueries({ queryKey: ['users'], });
            },

        });

    if (usersQuery.isPending) {
        return (
            <View style={styles.center}>
                <ActivityIndicator
                    size="large"
                    color="#e85d3f"
                />

                <Text>
                    Loading users...
                </Text>

            </View>
        );
    }

    if (usersQuery.isError) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>
                    {usersQuery.error.message}
                </Text>

                <Pressable
                    onPress={() =>
                        usersQuery.refetch()
                    }
                >
                    <Text style={styles.retry}>
                        Try again
                    </Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.heading}>
                <View>
                    <Text style={styles.title}>
                        People
                    </Text>

                    <Text style={styles.meta}>
                        {usersQuery.data.length}{' '}
                        cached records
                    </Text>

                </View>

                <Pressable
                    style={styles.add}
                    onPress={() =>
                        navigation.navigate('AddUser')
                    }
                >
                    <Text style={styles.addText}>
                        + Add
                    </Text>
                </Pressable>
            </View>
            <FlatList
                data={usersQuery.data}
                keyExtractor={user =>
                    String(user.id)
                }
                refreshing={
                    usersQuery.isRefetching
                }
                onRefresh={
                    usersQuery.refetch
                }
                renderItem={({ item }) => (
                    <Pressable
                        style={styles.row}
                        onPress={() =>
                            navigation.navigate(
                                'UserDetail',
                                {
                                    userId: item.id,
                                },
                            )
                        }
                    >
                        <View style={styles.avatar}>
                            <Text
                                style={styles.avatarText}
                            >
                                {item.name.charAt(0)}
                            </Text>
                        </View>
                        <View style={styles.info}>
                            <Text style={styles.name}>
                                {item.name}
                            </Text>
                            <Text style={styles.email}>
                                {item.email}
                            </Text>
                        </View>
                        <Pressable
                            hitSlop={10}
                            disabled={
                                deleteMutation.isPending
                            }
                            onPress={() =>
                                deleteMutation.mutate(
                                    item.id,
                                )
                            }
                        >

                            <Text style={styles.delete}>
                                {deleteMutation.isPending
                                    ? 'Deleting...'
                                    : 'Delete'}
                            </Text>
                        </Pressable>
                    </Pressable>

                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f7f8fc',
    },

    center: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },

    heading: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 18,
    },

    title: {
        color: '#16213e',
        fontSize: 30,
        fontWeight: '800',
    },

    meta: {
        color: '#68738b',
        marginTop: 4,
    },

    add: {
        backgroundColor: '#e85d3f',
        borderRadius: 7,
        paddingHorizontal: 15,
        paddingVertical: 10,
    },

    addText: {
        color: '#fff',
        fontWeight: '700',
    },

    row: {
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 9,
        flexDirection: 'row',
        marginBottom: 10,
        padding: 14,
    },

    avatar: {
        alignItems: 'center',
        backgroundColor: '#f6c453',
        borderRadius: 22,
        height: 44,
        justifyContent: 'center',
        width: 44,
    },

    avatarText: {
        color: '#16213e',
        fontSize: 18,
        fontWeight: '800',
    },

    info: {
        flex: 1,
        marginLeft: 12,
    },

    name: {
        color: '#16213e',
        fontSize: 16,
        fontWeight: '700',
    },

    email: {
        color: '#68738b',
        marginTop: 4,
    },

    delete: {
        color: '#c24737',
        fontSize: 12,
        fontWeight: '700',
    },

    error: {
        color: '#c24737',
        marginBottom: 14,
    },

    retry: {
        color: '#e85d3f',
        fontWeight: '700',
    },

});