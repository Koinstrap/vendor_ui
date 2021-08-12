import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Platform, View } from "react-native";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";

import Template from "./screens";
import { default as mapping } from "./assets/mapping.json";

import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";

import ApiContext, { MainApiContext } from "./contexts/ApiContexts";
import { positions, Provider as AlertProvider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";

const options = {
  timeout: 3000,
  position: positions.TOP_RIGHT,
};

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

export default function App() {
  injectWebCss();
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  return (
    <>
      <AlertProvider template={AlertTemplate} {...options}>
        <IconRegistry icons={EvaIconsPack} />
        <SafeAreaProvider>
          <ApiContext>
            <AppWithLoading colorScheme={colorScheme} />
          </ApiContext>
        </SafeAreaProvider>
      </AlertProvider>
    </>
  );
}

const AppWithLoading = ({ colorScheme }) => {
  const isLoadingComplete = useCachedResources();
  const { settings } = React.useContext(MainApiContext);

  if (!isLoadingComplete || !settings?.theme?.colors) {
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.2)",
        }}
      >
        <Loader type="Bars" color="white" height={60} width={150} />
      </View>
    );
  } else {
    return (
      <ApplicationProvider
        {...eva}
        theme={{ ...eva.light, ...(settings.theme?.colors || {}) }}
        customMapping={mapping}
      >
        <Template colorScheme={colorScheme} />
        <StatusBar />
      </ApplicationProvider>
    );
  }
};

const noGlow = `
textarea, select, input, button {
	-webkit-appearance: none;
	outline: none!important;
}
textarea:focus, select:focus, input:focus, button:focus {
	-webkit-appearance: none;
	outline: none!important;
}
`;
const injectWebCss = () => {
  // Only on web
  if (Platform.OS != "web") return;

  // Inject style
  const style = document.createElement("style");
  style.textContent = noGlow;
  return document.head.append(style);
};
