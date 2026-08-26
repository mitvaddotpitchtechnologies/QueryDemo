import { useQuery } from '@tanstack/react-query';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import { fetchUser } from '../api/userApi';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'UserDetail'>;
export default function UserDetailScreen({ route, navigation }: Props) {
    const query = useQuery({ queryKey: ['users', route.params.userId], queryFn: () => fetchUser(route.params.userId) });
    if (query.isPending) return <ActivityIndicator style={styles.center} color="#e85d3f" size="large" />;
    if (query.isError) return <View style={styles.center}>
        <Text>
            {query.error.message}
        </Text>
    </View>;
    const user = query.data;
    return (
        <View style={styles.container}>
            <View style={styles.hero}>
                <Text style={styles.avatar}>{user.name.charAt(0)}</Text>
                {/* <Text style={styles.avatar}>{user.name}</Text>
                    <Text style={styles.username}>@{user.username}</Text>
                    <Text style={styles.name}>{user.name}</Text>
                    <Text style={styles.username}>@{user.name}</Text>
                */}
                <Text style={styles.name}>{user.name}</Text>
                <Text style={styles.username}>@{user.username}</Text>
            </View>
            <View style={styles.details}>
                <Detail label="Email" value={user.email} />
                <Detail label="Phone" value={user.phone} />
                <Detail label="Company" value={user.company.name} />
                <Detail label="Website" value={user.website} />
            </View>
            <Button title="Edit user"
                onPress={() => navigation.navigate('EditUser', { userId: user.id })}
                color="#e85d3f" />
        </View>
    );
}
function Detail({ label, value }: { label: string; value: string }) {
    return (
        <View style={styles.detail}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f7f8fc',
        flex: 1,
        padding: 24
    },
    center: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    },
    hero: {
        alignItems: 'center',
        paddingVertical: 20
    },
    avatar: {
        alignItems: 'center',
        backgroundColor: '#f6c453',
        borderRadius: 42,
        color: '#16213e',
        fontSize: 34,
        fontWeight: '800',
        height: 84,
        paddingTop: 20,
        textAlign: 'center',
        width: 84
    },
    name: {
        color: '#16213e',
        fontSize: 26,
        fontWeight: '800',
        marginTop: 14
    },
    username: {
        color: '#68738b',
        marginTop: 4
    },
    details: {
        backgroundColor: '#fff',
        borderRadius: 9,
        marginBottom: 24,
        padding: 18
    },
    detail: {
        borderBottomColor: '#edf0f5',
        borderBottomWidth: 1,
        paddingVertical: 12
    },
    label: {
        color: '#68738b',
        fontSize: 12,
        textTransform: 'uppercase'
    },
    value: {
        color: '#16213e',
        fontSize: 16,
        marginTop: 4
    }
});