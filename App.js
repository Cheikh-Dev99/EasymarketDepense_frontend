import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import {
  Picker,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Provider } from "react-redux";
import AjoutDepenses from "./screens/AjoutDepenses";
import Depenses from "./screens/Depenses";
import DetailDepenses from "./screens/DetailDepenses";
import Modules from "./screens/Modules";
import { store } from "./src/redux/store";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Modules">
          <Stack.Screen
            name="Modules"
            component={Modules}
            options={{ 
              title: "Modules",
              headerShown: false,
              headerTitleStyle: {
                fontWeight: "bold",
              }
            }}
          />
          <Stack.Screen
            name="Dépenses"
            component={Depenses}
            options={({ navigation }) => ({
              title: "Dépenses",
              headerTitleAlign: "center",
              headerTitleStyle: {
                fontWeight: "bold",
              },
              headerLeft: () => (
                <TouchableOpacity
                  style={{ marginLeft: 15 }}
                  onPress={() => navigation.navigate('Modules')} // Modifié pour naviguer explicitement vers Modules
                >
                  <MaterialCommunityIcons 
                    name="arrow-left" 
                    size={24} 
                    color="black" 
                  />
                </TouchableOpacity>
              ),
            })}
          />
          <Stack.Screen
            name="AjoutDepenses"
            component={AjoutDepenses}
            options={({ navigation, route }) => ({
              title: "Ajout dépense",
              headerStyle: {
                height: 100,
              },
              headerTitleStyle: {
                fontWeight: "bold",
              },
            })}
          />
          <Stack.Screen
            name="DetailDepenses"
            component={DetailDepenses}
            options={({ navigation, route }) => ({
              title: "Détail dépense",
              headerStyle: {
                height: 100,
              },
              headerTitleStyle: {
                fontWeight: "bold",
              },
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
