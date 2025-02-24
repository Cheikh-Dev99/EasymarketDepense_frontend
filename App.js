import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Provider } from "react-redux";
import Accueil from "./screens/Accueil";
import AjoutDepenses from "./screens/AjoutDepenses";
import Depenses from "./screens/Depenses";
import DetailDepenses from "./screens/DetailDepenses";
import Modules from "./screens/Modules";
import { store } from "./src/redux/store";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native";

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Accueil">
          <Stack.Screen
            name="Accueil"
            component={Accueil}
            options={{ 
              title: "Accueil",
              headerShown: false,
            }}
          />
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
                  onPress={() => navigation.navigate('Modules')}
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
