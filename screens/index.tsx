import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React, { useContext } from "react";
import { ColorSchemeName } from "react-native";
import BuyScreen from "./BuyScreen";
import ContactScreen from "./ContactScreen";
import HomeScreen from "./HomeScreen";
import OverviewScreen from "./OverviewScreen";
import SearchScreen from "./SearchScreen";
import SellScreen from "./SellScreen";
import Favicon from "react-favicon";

import { MainApiContext } from "../contexts/ApiContexts";

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </>
  );
}

const Stack = createStackNavigator();

function RootNavigator() {
  const { settings } = useContext(MainApiContext);
  return (
    <>
      <Favicon url={settings?.logo} />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: "transparent" },
          cardOverlayEnabled: true,
          cardStyleInterpolator: ({ current: { progress } }) => ({
            cardStyle: {
              opacity: progress.interpolate({
                inputRange: [0, 0.5, 0.9, 1],
                outputRange: [0, 0.25, 0.7, 1],
              }),
            },
            overlayStyle: {
              opacity: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.8],
                extrapolate: "clamp",
              }),
            },
          }),
        }}
        mode="modal"
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: settings.name + " - Home" }}
        />
        <Stack.Screen name="Contact" component={ContactScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Overview" component={OverviewScreen} />
        <Stack.Screen name="Buy" component={BuyScreen} />
        <Stack.Screen name="Sell" component={SellScreen} />
      </Stack.Navigator>
    </>
  );
}
