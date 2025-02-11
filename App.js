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
import AjoutDepenses from "./screens/AjoutDepenses";
import Depenses from "./screens/Depenses";
import DetailDepenses from "./screens/DetailDepenses";
import Modules from "./screens/Modules";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Modules">
        <Stack.Screen
          name="Modules"
          component={Modules}
          options={{ title: "Modules", headerShown: false }}
        />
        <Stack.Screen
          name="Dépenses"
          component={Depenses}
          options={{
            title: "Dépenses",
            headerTitleAlign: "center",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
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
            headerRight: () => (
              <View style={{ flexDirection: "row", marginRight: 10 }}>
                <TouchableOpacity
                  style={{
                    width: 100,
                    marginRight: 5,
                    borderWidth: 1,
                    borderColor: "#FF3B30",
                    padding: 10,
                    borderRadius: 5,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => navigation.goBack()}
                >
                  <Text
                    style={{
                      color: "#FF3B30",
                      fontWeight: "500",
                      textAlign: "center",
                    }}
                  >
                    Supprimer
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: 100,
                    borderWidth: 1,
                    borderColor: "#05365F",
                    backgroundColor: "#05365F",
                    padding: 10,
                    borderRadius: 5,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => {
                    if (route.params?.component?.handleSave) {
                      route.params.component.handleSave();
                    }
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "500",
                      textAlign: "center",
                    }}
                  >
                    Enregistrer
                  </Text>
                </TouchableOpacity>
              </View>
            ),
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
            headerRight: () => (
              <View style={{ flexDirection: "row", marginRight: 10 }}>
                <TouchableOpacity
                  style={{
                    width: 100,
                    marginRight: 5,
                    borderWidth: 1,
                    borderColor: "#FF3B30",
                    padding: 10,
                    borderRadius: 5,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => {
                    if (route.params?.component?.handleDelete) {
                      route.params.component.handleDelete();
                    }
                  }}
                >
                  <Text
                    style={{
                      color: "#FF3B30",
                      fontWeight: "500",
                      textAlign: "center",
                    }}
                  >
                    Supprimer
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: 100,
                    borderWidth: 1,
                    borderColor: "#05365F",
                    backgroundColor: "#05365F",
                    padding: 10,
                    borderRadius: 5,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => {
                    if (route.params?.component?.handleSave) {
                      route.params.component.handleSave();
                    }
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "500",
                      textAlign: "center",
                    }}
                  >
                    Enregistrer
                  </Text>
                </TouchableOpacity>
              </View>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
