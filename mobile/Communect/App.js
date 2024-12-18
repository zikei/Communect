import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Login';
import Group from './Group';
import MockGroup from './MockGroup';
import DMList from './DMList';
import ChatScreen from './ChatScreen';
import Setting from './Setting';
import Register from './Register';
import AccountEdit from './AccountEdit';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Group" component={Group} options={{ title: 'グループ' }} />
        {/*<Stack.Screen name="Group" component={MockGroup} options={{ title: 'グループ' }} />*/}
        <Stack.Screen name="DMList" component={DMList} options={{ title: 'DM一覧' }} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ title: 'チャット' }} />
        <Stack.Screen name="Setting" component={Setting} options={{ title: '設定' }} />
        <Stack.Screen name="Register" component={Register} options={{ title: 'アカウント登録' }} />
        <Stack.Screen name="AccountEdit" component={AccountEdit} options={{ title: 'アカウント設定' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
