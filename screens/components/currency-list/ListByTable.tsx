import React, { useContext } from "react";
import { Button, Text } from "@ui-kitten/components";
import { View, TouchableOpacity, Image } from "react-native";
import useScreenSize from "../../../hooks/useScreenSize";
import { useNavigation } from "@react-navigation/core";
import { MainApiContext } from "../../../contexts/ApiContexts";

import currencyLogos from "../../../assets/images/currencies";

export default function ListByTable({ theme }) {
  const isSmallDevice = useScreenSize();
  const navigation = useNavigation();

  const { currencies = [], setCurrency } = useContext(MainApiContext);

  return (
    <View style={[!isSmallDevice && { alignItems: "center" }]}>
      <View
        style={[
          {
            marginTop: 25,
            paddingBottom: 0,
            marginBottom: 25,

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
                    source={currencyLogos[currency.currency]}
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
                {isSmallDevice && <Text>NGN 18,668,970.00</Text>}
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
