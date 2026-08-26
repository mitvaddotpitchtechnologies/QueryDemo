import React, { useState, } from 'react';
import {
    Button,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { NativeStackScreenProps, } from '@react-navigation/native-stack';
import { useCreateRTKUserMutation, RTKUserInput, } from '../api/RTKUserApi';
import { RootStackParamList, } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'RTKAddUser'>;

export default function RTKAddUserScreen({ navigation, }: Props) {

    const [form, setForm,] = useState<RTKUserInput>({
        name: '',
        username: '',
        email: '',
        phone: '',
    });

    const [
        createUser,
        {
            isLoading,
            isError,
            error,
        },
    ] =
        useCreateRTKUserMutation();

    const update = (
        key: keyof RTKUserInput,
        value: string,
    ) => {

        setForm({
            ...form,
            [key]: value,
        });
    };

    const handleCreate = async () => {
        try {
            const user =
                await createUser(form).unwrap(); // RTK Query returns a Promise with an unwrap() method that resolves to the actual data or throws an error if the request fails.   

            console.log('RTK Created user:', user,);

            navigation.replace(
                'RTKUserDetail',
                {
                    userId: user.id,
                },
            );

        } catch (requestError) {
            console.log('RTK create error:', requestError,);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                RTK Add User
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
                keyboardType="email-address"
                autoCapitalize="none"
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
                    isLoading
                        ? 'Creating...'
                        : 'Create User'
                }
                disabled={
                    isLoading ||
                    !form.name ||
                    !form.email
                }
                color="#e85d3f"
                onPress={handleCreate}
            />

            {isError && (
                <Text style={styles.error}>
                    {String(error)}
                </Text>

            )}
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#f7f8fc',
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