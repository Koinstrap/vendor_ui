import React, { useContext } from "react";
import { Button, Text } from "@ui-kitten/components";
import { View, TouchableOpacity, Image } from "react-native";
import useScreenSize from "../../../hooks/useScreenSize";
import { useNavigation } from "@react-navigation/core";
import { MainApiContext, domain } from "../../../contexts/ApiContexts";
import { useAlert } from "react-alert";

import currencyLogos from "../../../assets/images/currencies";

export default function ListByTable({ theme }) {
  const isSmallDevice = useScreenSize();
  const navigation = useNavigation();

  const alert = useAlert();

  const { currencies = [], setCurrency, settings } = useContext(MainApiContext);

  return (
    <View style={[!isSmallDevice && { alignItems: "center" }]}>
      <View
        style={[
          {
            marginTop: 25,
            paddingBottom: 0,
            marginBottom: 20,
            // box-shadow: 0 29px 21px -34px rgb(23 49 84 / 82%)
            //   alignSelf: "center",
          },
          !isSmallDevice && {
            maxWidth: 1200,
            minWidth: 900,
            borderWidth: 1,
            borderColor: "#ccc",
            marginHorizontal: 10,
            padding: 15,
            borderRadius: 10,
            elevation: 5,
          },
          isSmallDevice && {
            padding: 10,
          },
        ]}
      >
        {currencies.map((currency, index) => (
          <CanPressOrNot
            isSmallDevice={isSmallDevice}
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
            key={currency.currency}
          >
            <View
              key={currency.currency}
              style={[
                {
                  flexDirection: "row",
                  marginBottom: 25,
                  alignItems: "center",
                },
              ]}
            >
              <View style={{ paddingRight: 10 }}>
                <View style={{ height: 30, width: 30 }}>
                  <Image
                    source={{
                      uri: `https://${domain}/img/currencies/${currency.currency.toLowerCase()}.png`,
                    }}
                    style={{ height: undefined, width: undefined, flex: 1 }}
                  />
                </View>
              </View>

              <View
                style={[
                  { flex: 1, paddingRight: 10 },
                  isSmallDevice && {
                    justifyContent: "space-around",
                  },
                ]}
              >
                <Text category="s1">{currency.display_name}</Text>
                <View style={{ paddingTop: 5 }} />
                <Text appearance="hint" category="c1">
                  {currency.currency}
                </Text>
                {isSmallDevice && (
                  <Text>
                    NGN {(currency.price * currency.buy_rate).toLocaleString()}
                  </Text>
                )}
              </View>

              <View
                style={[
                  { flex: 1, paddingRight: 10 },
                  isSmallDevice && {
                    justifyContent: "space-around",
                    paddingRight: 0,
                    flex: undefined,
                  },
                ]}
              >
                <Text>Buy: {currency.buy_rate}/NGN</Text>
                <View style={{ paddingTop: 5 }} />
                <Text>Sell: {currency.sell_rate}/NGN</Text>
              </View>
              {!isSmallDevice && (
                <>
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text>
                      NGN{" "}
                      {(currency.price * currency.buy_rate).toLocaleString()}
                    </Text>
                  </View>

                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text
                      status={
                        currency.change_percentage >= 0 ? "success" : "danger"
                      }
                    >
                      {currency.change_percentage} %
                    </Text>
                  </View>
                </>
              )}

              {!isSmallDevice && (
                <View style={{}}>
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
                      navigation.navigate("Buy", {
                        currency: currency.currency,
                      });
                    }}
                  >
                    Trade
                  </Button>
                </View>
              )}
            </View>
          </CanPressOrNot>
        ))}
      </View>
    </View>
  );
}

const CanPressOrNot = ({ onPress, children, isSmallDevice }) => {
  if (isSmallDevice) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        {children}
      </TouchableOpacity>
    );
  }
  return <>{children}</>;
};
