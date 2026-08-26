import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppDispatch } from '../redux/hooks';
import { signIn } from '../redux/store';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ }: Props) {
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState('demo@example.com');
    const [password, setPassword] = useState('password');

    return (
        <View style={styles.container}>
            <Text style={styles.kicker}>
                SERVER STATE LAB
            </Text>
            <Text style={styles.title}>
                Welcome back.
            </Text>
            <Text style={styles.subtitle}>
                Explore cached users with TanStack Query.
            </Text>
            <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
            />
            <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                secureTextEntry
                style={styles.input}
            />
            <Button
                title="Sign in"
                disabled={!email || !password}
                onPress={() => dispatch(signIn(email))}
                color="#e85d3f" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 28,
        backgroundColor: '#f7f8fc'
    },
    kicker: {
        color: '#e85d3f',
        fontWeight: '700',
        letterSpacing: 1.5,
        marginBottom: 12
    },
    title: {
        color: '#16213e',
        fontSize: 38,
        fontWeight: '800',
        marginBottom: 8
    },
    subtitle: {
        color: '#68738b',
        fontSize: 16,
        marginBottom: 32
    },
    input: {
        backgroundColor: '#fff',
        borderColor: '#e1e5ee',
        borderRadius: 8,
        borderWidth: 1,
        marginBottom: 14,
        padding: 14
    },
});