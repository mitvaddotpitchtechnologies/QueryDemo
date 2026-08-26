import React from 'react';

import {
    ActivityIndicator,
    Button,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { NativeStackScreenProps, } from '@react-navigation/native-stack';
import { useGetRTKUserQuery, } from '../api/RTKUserApi';
import { RootStackParamList, } from '../navigation/AppNavigator';
type Props = NativeStackScreenProps<RootStackParamList, 'RTKUserDetail'>;

export default function RTKUserDetailScreen({ route, navigation, }: Props) {
    const { userId } = route.params;
    const {
        data: user,
        isLoading,
        isError,
        error,
    } =
        useGetRTKUserQuery(userId);

    if (isLoading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator
                    size="large"
                    color="#e85d3f"
                />
            </View>
        );
    }

    if (isError || !user) {
        return (
            <View style={styles.center}>
                <Text>
                    {error
                        ? 'Failed to load user'
                        : 'User not found'}
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.hero}>
                <Text style={styles.avatar}>
                    {user.name.charAt(0)}
                </Text>
                <Text style={styles.name}>
                    {user.name}
                </Text>
                <Text style={styles.username}>
                    @{user.username}
                </Text>
            </View>
            <View style={styles.details}>
                <Text style={styles.label}>
                    EMAIL
                </Text>
                <Text style={styles.value}>
                    {user.email}
                </Text>
                <Text style={styles.label}>
                    PHONE
                </Text>
                <Text style={styles.value}>
                    {user.phone}
                </Text>
                <Text style={styles.label}>
                    COMPANY
                </Text>
                <Text style={styles.value}>
                    {user.company.name}
                </Text>
                <Text style={styles.label}>
                    WEBSITE
                </Text>
                <Text style={styles.value}>
                    {user.website}
                </Text>
            </View>
            <Button
                title="Edit User"
                color="#e85d3f"
                onPress={() =>
                    navigation.navigate(
                        'RTKEditUser',
                        {
                            userId: user.id,
                        },
                    )
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#f7f8fc',
    },

    center: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },

    hero: {
        alignItems: 'center',
        paddingVertical: 20,
    },

    avatar: {
        backgroundColor: '#f6c453',
        borderRadius: 42,
        fontSize: 34,
        fontWeight: '800',
        width: 60,
        height: 60,
        textAlign: 'center',
        lineHeight: 70,
        color: '#16213e',
    },

    name: {
        color: '#16213e',
        fontSize: 26,
        fontWeight: '800',
        marginTop: 14,
    },

    username: {
        color: '#68738b',
        marginTop: 4,
    },

    details: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 24,
        padding: 18,
    },

    label: {
        color: '#68738b',
        fontSize: 12,
        marginTop: 12,
    },

    value: {
        color: '#16213e',
        fontSize: 16,
        marginTop: 4,
    },

});