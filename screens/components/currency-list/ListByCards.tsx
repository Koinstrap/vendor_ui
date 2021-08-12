import React, { useContext } from "react";
import { Button, Text, Divider } from "@ui-kitten/components";
import { View, Image } from "react-native";
import useScreenSize from "../../../hooks/useScreenSize";
import { useNavigation } from "@react-navigation/native";
import { MainApiContext } from "../../../contexts/ApiContexts";

import currencyLogos from "../../../assets/images/currencies";
import { useAlert } from "react-alert";

export default function ListByCards({ theme }) {
  const isSmallDevice = useScreenSize();
  const navigation = useNavigation();

  const alert = useAlert();

  const { currencies = [], setCurrency, settings } = useContext(MainApiContext);

  return (
    <View
      style={{
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: 900,
        marginTop: 20,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {currencies.map((currency, index) => (
          <View
            key={currency.currency}
            style={{
              width: isSmallDevice ? "100%" : "49%",
              paddingVertical: 15,
              paddingHorizontal: 10,
            }}
          >
            <View
              style={{
                backgroundColor: theme["color-basic-100"],
                borderWidth: 1,
                minHeight: 100,
                borderRadius: 10,
                paddingVertical: 15,
                borderColor: theme["outline-color"],
                elevation: 5,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  paddingHorizontal: 15,
                  paddingBottom: 15,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <View style={{ paddingRight: 20 }}>
                  <View style={{ height: 40, width: 40 }}>
                    <Image
                      source={currencyLogos[currency.currency]}
                      style={{ height: undefined, width: undefined, flex: 1 }}
                    />
                  </View>
                </View>

                <View style={{ width: "100%" }}>
                  <Text>
                    {currency.display_name} ({currency.currency}){" "}
                  </Text>

                  <View style={{}}>
                    <Text>
                      NGN{" "}
                      {(currency.price * currency.buy_rate).toLocaleString()}{" "}
                    </Text>
                    <Text
                      status={
                        currency.change_percentage >= 0 ? "success" : "danger"
                      }
                    >
                      {currency.change_percentage} %
                    </Text>
                  </View>
                </View>
              </View>

              <Divider />

              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    flex: 1,
                    paddingVertical: 15,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text>Buy Rate</Text>
                  <Text>{currency.buy_rate}/NGN</Text>
                </View>
                <View
                  style={{
                    width: 1,
                    backgroundColor: theme["outline-color"],
                    height: "100%",
                  }}
                />
                <View
                  style={{
                    flex: 1,
                    paddingVertical: 15,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text>Sell Rate</Text>
                  <Text>{currency.sell_rate}/NGN</Text>
                </View>
              </View>

              <Divider />
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 15,
                }}
              >
                <Button
                  size="small"
                  onPress={() => {
                    if (!settings.is_available) {
                      alert.error(
                        "Trading is temporarily disabled, Kindly try again later."
                      );
                      return;
                    }
                    setCurrency(currency);
                    navigation.navigate("Buy", { currency: currency.currency });
                  }}
                >
                  Trade
                </Button>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
