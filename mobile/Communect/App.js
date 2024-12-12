import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Login';  // あなたのログイン画面
import Group from './Group';  // あなたのグループ画面

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Group" component={Group} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
