import React from "react";
import { Button, Icon } from "@ui-kitten/components";
import { View, TouchableOpacity, Image } from "react-native";
import useScreenSize from "../../../hooks/useScreenSize";
import { useNavigation } from "@react-navigation/core";

export default function SingleNav({ theme }) {
  const small = useScreenSize();
  const navigation = useNavigation();
  return (
    <View
      style={{
        position: "sticky",
        alignItems: "center",
        left: 0,
        right: 0,
        top: 10,
        zIndex: 100000,
      }}
    >
      <View
        style={{
          borderRadius: 150,
          borderWidth: 1,
          borderColor: theme["color-primary-600"],
          backgroundColor: theme["color-basic-100"],
          paddingHorizontal: 30,
          paddingVertical: 15,
          minWidth: small ? 240 : 320,
          height: small ? 50 : 75,
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <View style={{ height: 30, width: 30 }}>
          <Image
            source={require("../../../assets/images/slack-logo.jpeg")}
            style={{ height: undefined, width: undefined, flex: 1 }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {!small ? (
            <Button size="medium" style={{ borderRadius: 400 }}>
              Contact
            </Button>
          ) : (
            <>
              <TouchableOpacity activeOpacity={0.8}>
                <Icon
                  name="email-outline"
                  height={30}
                  fill={theme["color-primary-600"]}
                  width={30}
                />
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            activeOpacity={0.8}
            style={{ paddingLeft: 15 }}
            onPress={() => navigation.navigate("Search")}
          >
            <Icon
              name="search-outline"
              height={30}
              fill={theme["color-primary-600"]}
              width={30}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
