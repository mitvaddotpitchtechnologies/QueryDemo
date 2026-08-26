import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector } from '../redux/hooks';
import AddUserScreen from '../screens/AddUserScreen';
import EditUserScreen from '../screens/EditUserScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import UserDetailScreen from '../screens/UserDetailScreen';
import UsersScreen from '../screens/UsersScreen';
import RTKUsersScreen from '../screens/RTKUsersScreen';

import RTKUserDetailScreen from '../screens/RTKUserDetailScreen';

import RTKAddUserScreen from '../screens/RTKAddUserScreen';

import RTKEditUserScree from '../screens/RTKEditUserScreen';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Users: undefined;
  UserDetail: { userId: number };
  AddUser: undefined;
  EditUser: { userId: number };
    RTKUsers: undefined;
    RTKUserDetail: { userId: number };
    RTKAddUser: undefined;
    RTKEditUser: { userId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerTintColor: '#16213e', headerShadowVisible: false }}>
        {!isLoggedIn ? (
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'QueryDemo' }} />
            <Stack.Screen name="Users" component={UsersScreen} options={{ title: 'Users' }} />
            <Stack.Screen name="UserDetail" component={UserDetailScreen} options={{ title: 'User details' }} />
            <Stack.Screen name="AddUser" component={AddUserScreen} options={{ title: 'Add user' }} />
            <Stack.Screen name="EditUser" component={EditUserScreen} options={{ title: 'Edit user' }} />
            <Stack.Screen name="RTKUsers" component={RTKUsersScreen} options={{ title: 'RTK Users' }} />
            <Stack.Screen name="RTKUserDetail" component={RTKUserDetailScreen} options={{ title: 'RTK User details' }} />
            <Stack.Screen name="RTKAddUser" component={RTKAddUserScreen} options={{ title: 'Add RTK user' }} />
            <Stack.Screen name="RTKEditUser" component={RTKEditUserScree} options={{ title: 'Edit RTK user' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}