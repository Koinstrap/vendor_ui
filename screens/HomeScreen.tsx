import React, { useContext } from "react";
import { Layout, Text, useTheme } from "@ui-kitten/components";
import { View, ScrollView, TouchableOpacity } from "react-native";
import FullColor from "./components/headers/FullColor";
import FullImage from "./components/headers/FullImage";
import HalfImage from "./components/headers/HalfImage";
import SplitColor from "./components/headers/SplitColor";
import renderSwitch from "../hooks/renderSwitch";
import ListByTable from "./components/currency-list/ListByTable";
import ListByCards from "./components/currency-list/ListByCards";
import SingleNav from "./components/navbars/SingleNav";
import SplitNav from "./components/navbars/SplitNav";
import { MainApiContext } from "../contexts/ApiContexts";
import * as WebBrowser from "expo-web-browser";

export default function HomeScreen() {
  const theme = useTheme();

  const { settings } = useContext(MainApiContext);

  return (
    <Layout style={{ flex: 1 }}>
      <NavBar
        theme={theme}
        current={settings?.theme?.navbar}
        settings={settings}
      />
      <ScrollView
        style={{
          flex: 1,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <HeroBanner
          theme={theme}
          current={settings?.theme?.header}
          settings={settings}
        />

        <CurrencyList
          theme={theme}
          current={settings?.theme?.list}
          settings={settings}
        />

        <View style={{ alignItems: "center", paddingVertical: 20 }}>
          <Text category="s1">
            © {`${new Date().getFullYear()} ${settings.name}`}. All rights
            reserved.
          </Text>
          {settings?.theme?.header.includes("image") && (
            <View
              style={{
                flexDirection: "row",
                marginBottom: 30,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 10,
              }}
            >
              <Text category="p2">Photo by </Text>
              <TouchableOpacity
                onPress={() => {
                  WebBrowser.openBrowserAsync(
                    settings?.theme?.banner?.user.link
                  );
                }}
              >
                <Text
                  category="p2"
                  style={{
                    textDecorationStyle: "solid",
                    textDecorationLine: "underline",
                  }}
                >
                  {settings?.theme?.banner?.user.username}{" "}
                </Text>
              </TouchableOpacity>
              <Text category="p2">on </Text>
              <TouchableOpacity
                onPress={() => {
                  WebBrowser.openBrowserAsync("https://unsplash.com");
                }}
              >
                <Text
                  category="p2"
                  style={{
                    textDecorationStyle: "solid",
                    textDecorationLine: "underline",
                  }}
                >
                  Unsplash
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </Layout>
  );
}

function NavBar({ theme, current = "single-nav", settings }) {
  return renderSwitch(current, {
    "single-nav": <SingleNav theme={theme} />,
    "split-nav": <SplitNav theme={theme} />,
  });
}

function HeroBanner({ theme, current = "split-color", settings }) {
  const { intro, tagline, banner, ...rest } = settings.theme;

  return renderSwitch(current, {
    "full-color": <FullColor theme={theme} {...{ intro, tagline }} />,
    "full-image": (
      <FullImage
        theme={theme}
        {...{ intro, tagline }}
        image={banner?.urls?.regular}
      />
    ),
    "half-image": (
      <HalfImage
        theme={theme}
        {...{ intro, tagline }}
        image={banner?.urls?.regular}
      />
    ),
    "split-color": <SplitColor theme={theme} {...{ intro, tagline }} />,
  });
}

function CurrencyList({ theme, current = "by-cards", settings }) {
  return renderSwitch(current, {
    "by-table": <ListByTable theme={theme} />,
    "by-cards": <ListByCards theme={theme} />,
  });
}
