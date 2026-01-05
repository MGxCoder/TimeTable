import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


import Login from "../screens/Login";
import SignUp from "../screens/SignUp";
import HomeScreen from "../screens/HomeScreen";
import CreateTimetable from "../screens/CreateTimetable";
import ViewTimetableScreen from "../screens/ViewTimetableScreen";
import ApplyLeaveScreen from "../screens/ApplyLeaveScreen";
import AdminLeavePanel from "../screens/AdminLeavePanel";


export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  HomeScreen: undefined;
  CreateTimetable: undefined;
  ViewTimetable: undefined;
  ApplyLeave: undefined;
  AdminLeavePanel: undefined;
};

// Create the Stack Navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="CreateTimetable" component={CreateTimetable} />
        <Stack.Screen name="ViewTimetable" component={ViewTimetableScreen} />
        <Stack.Screen name="ApplyLeave" component={ApplyLeaveScreen} />
        <Stack.Screen name="AdminLeavePanel" component={AdminLeavePanel} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
