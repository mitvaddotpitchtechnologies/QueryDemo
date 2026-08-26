import React from 'react';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useGetRTKUsersQuery, useDeleteRTKUserMutation, } from '../api/RTKUserApi';
import { NativeStackScreenProps, } from '@react-navigation/native-stack';
import { RootStackParamList, } from '../navigation/AppNavigator';

type Props =
    NativeStackScreenProps<
        RootStackParamList,
        'RTKUsers'
    >;

export default function RTKUsersScreen({ navigation, }: Props) {

    const {
        data: users = [],
        isLoading,
        isFetching,
        isError,
        refetch,
    } =
        useGetRTKUsersQuery();

    const [deleteUser, { isLoading: isDeleting, },] = useDeleteRTKUserMutation();

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator
                    size="large"
                    color="#e85d3f"
                />

                <Text>
                    Loading RTK users...
                </Text>

            </View>
        );
    }

    if (isError) {
        return (
            <View style={styles.center}>
                <Text style={styles.error}>
                    Failed to load users
                </Text>
                <Pressable
                    onPress={refetch}
                >
                    <Text style={styles.retry}>
                        Try again
                    </Text>
                </Pressable>
            </View>
        );
    }

    const handleDelete = async (
        id: number,
    ) => {
        try {
            await deleteUser(id).unwrap();
        } catch (requestError) {
            console.log(
                'Delete error:',
                requestError,
            );

        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.heading}>
                <View>
                    <Text style={styles.title}>
                        RTK Users
                    </Text>
                    <Text style={styles.meta}>
                        Redux Toolkit Query
                    </Text>
                </View>
                <Pressable
                    style={styles.add}
                    onPress={() =>
                        navigation.navigate(
                            'RTKAddUser',
                        )
                    }
                >
                    <Text style={styles.addText}>
                        + Add
                    </Text>
                </Pressable>
            </View>
            {isFetching && (
                <Text style={styles.fetching}>
                    Refreshing...
                </Text>
            )}
            <FlatList
                data={users}
                showsVerticalScrollIndicator={false}
                keyExtractor={item =>
                    String(item.id)
                }
                refreshing={isFetching}
                onRefresh={refetch}
                renderItem={({ item }) => (
                    <Pressable
                        style={styles.row}
                        onPress={() =>
                            navigation.navigate(
                                'RTKUserDetail',
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
                            disabled={isDeleting}
                            onPress={() =>
                                handleDelete(item.id)
                            }
                        >
                            <Text style={styles.delete}>
                                {isDeleting
                                    ? '...'
                                    : 'Delete'}
                            </Text>
                            {/* <Text style={styles.delete}>
                                {isDeleting
                                    ? '...'
                                    : 'Delete'}
                            </Text> */}
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

    fetching: {
        marginBottom: 10,
        color: '#e85d3f',
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