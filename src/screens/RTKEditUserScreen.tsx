import React, { useEffect, useState, } from 'react';
import {
    ActivityIndicator,
    Button,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { NativeStackScreenProps, } from '@react-navigation/native-stack';
import { useGetRTKUserQuery, useUpdateRTKUserMutation, RTKUserInput, } from '../api/RTKUserApi';
import { RootStackParamList, } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'RTKEditUser'>;

export default function RTKEditUserScreen({ route, navigation, }: Props) {

    const { userId, } = route.params;
    const { data: user, isLoading, } = useGetRTKUserQuery(userId);
    const [updateUser, { isLoading: updating, },] = useUpdateRTKUserMutation();

    const [form, setForm,] = useState<RTKUserInput>({
        name: '',
        username: '',
        email: '',
        phone: '',
    });

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name,
                username: user.username,
                email: user.email,
                phone: user.phone,
            });
        }
    }, [user]);
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

    const update = (
        key: keyof RTKUserInput,
        value: string,
    ) => {
        setForm({
            ...form,
            [key]: value,
        });
    };

    const handleUpdate = async () => {
        try {
            await updateUser({
                id: userId,
                data: form,
            }).unwrap();
            navigation.goBack();
        } catch (error) {
            console.log(
                'RTK update error:',
                error,
            );

        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                RTK Edit User
            </Text>
            <TextInput
                placeholder="Name"
                value={form.name}
                onChangeText={value =>
                    update('name', value)
                }
                style={styles.input}
            />

            <TextInput
                placeholder="Username"
                value={form.username}
                onChangeText={value =>
                    update('username', value)
                }
                style={styles.input}
            />

            <TextInput
                placeholder="Email"
                value={form.email}
                onChangeText={value =>
                    update('email', value)
                }
                style={styles.input}
            />

            <TextInput
                placeholder="Phone"
                value={form.phone}
                onChangeText={value =>
                    update('phone', value)
                }
                style={styles.input}
            />

            <Button
                title={
                    updating
                        ? 'Updating...'
                        : 'Save Changes'
                }
                disabled={
                    updating ||
                    !form.name ||
                    !form.email
                }
                color="#e85d3f"
                onPress={handleUpdate}
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

});