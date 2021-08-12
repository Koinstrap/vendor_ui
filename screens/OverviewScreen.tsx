import React, { useContext, useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import {
  Text,
  Icon,
  useTheme,
  Spinner,
  Button,
  Divider,
} from "@ui-kitten/components";
import { useAlert } from "react-alert";

import { differenceInSeconds, fromUnixTime } from "date-fns";

import ModalContainer from "./components/ModalContainer";
import { MainApiContext } from "../contexts/ApiContexts";
import Clipboard from "expo-clipboard";
import QRCode from "react-native-qrcode-svg";
import currencyLogos from "../assets/images/currencies";

export default function OverviewScreen({ navigation }) {
  const theme = useTheme();
  const alert = useAlert();

  const { order } = useContext(MainApiContext);

  return (
    <ModalContainer>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 15,
            paddingHorizontal: 15,
          }}
        >
          <View>
            <Text category="s1">Order Details</Text>
          </View>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              name="close-circle-outline"
              height={30}
              width={30}
              fill={theme["color-basic-700"]}
            />
          </TouchableOpacity>
        </View>

        <Divider />

        <View
          style={{
            paddingVertical: 15,
            paddingHorizontal: 15,
            marginBottom: 15,
          }}
        >
          <View style={{ paddingVertical: 15 }}>
            <Text category="h6">Reference Number</Text>
            <Text category="s1">{order.reference}</Text>
          </View>

          <View style={{ paddingVertical: 15 }}>
            <Text category="h6">Buying Amount</Text>
            <Text category="s1">NGN {order.amount.toLocaleString()}</Text>
            <Text category="p2">
              Apr ~ {order.cryptoAmount} {order.currency}
            </Text>
          </View>

          <View style={{ paddingVertical: 15 }}>
            <Text category="h6">Timer</Text>
            <View style={{ flexDirection: "row" }}>
              <Text category="s1" status="danger">
                <Time>{order.time}</Time>
              </Text>
              <View style={{ paddingLeft: 10 }}>
                <Spinner size="tiny" status="danger" />{" "}
              </View>
            </View>
          </View>
        </View>

        <Divider />

        {order.type == "BUY" && (
          <>
            <View
              style={{
                paddingVertical: 15,
                paddingHorizontal: 15,
                marginTop: 15,
              }}
            >
              <Text category="h6">Receiving Account Details</Text>
              <View style={{ height: 5 }} />
              <Text category="p2">
                Kindly make a payment of your buying amount to the account
                details provided below. Your cryptocurrency will be released
                into your receiving address only when payment has been
                successfuly verified.
              </Text>
            </View>

            <View style={{ paddingHorizontal: 15 }}>
              <View style={{ paddingVertical: 15 }}>
                <Text category="h6">Account Name</Text>
                <Text category="s1">{order.accountName}</Text>
              </View>

              <View style={{ paddingVertical: 15 }}>
                <Text category="h6">Bank Name</Text>
                <Text category="s1">{order.bankName}</Text>
              </View>

              <View style={{ paddingVertical: 15 }}>
                <Text category="h6">Account Number</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text category="s1">{order.accountNumber}</Text>
                  <TouchableOpacity
                    style={{ paddingHorizontal: 10 }}
                    onPress={async () => {
                      await Clipboard.setString(order.accountNumber);
                      alert.success(`${order.bankName} Account Number Copied`);
                    }}
                  >
                    <Icon
                      name="copy"
                      fill={theme["color-primary-600"]}
                      width={20}
                      height={20}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </>
        )}

        {order.type == "SELL" && (
          <>
            <View
              style={{
                paddingVertical: 15,
                paddingHorizontal: 15,
                marginTop: 15,
              }}
            >
              <Text category="h6">Receiving Account Details</Text>
              <View style={{ height: 5 }} />
              <Text category="p2">
                Kindly make a payment of your selling amount to the address
                provided below. Your payment will be released to your bank
                account once your crypto has received at least payment one
                blockchain confirmation.
              </Text>
            </View>

            <View style={{ paddingHorizontal: 15 }}>
              <View style={{ paddingVertical: 15 }}>
                <View style={{}}>
                  <QRCode
                    logo={currencyLogos[order.currency]}
                    logoSize={40}
                    logoBackgroundColor="transparent"
                    value={order.address}
                    size={150}
                  />
                </View>
              </View>

              <View style={{ paddingVertical: 15 }}>
                <Text category="h6">{order.currency} Address</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    width: "100%",
                    paddingBottom: 10,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text category="s1">{order.address}</Text>
                  </View>
                  <TouchableOpacity
                    style={{ paddingHorizontal: 10 }}
                    onPress={async () => {
                      await Clipboard.setString(order.address);
                      alert.success(`${order.currency} Address Copied`);
                    }}
                  >
                    <Icon
                      name="copy"
                      fill={theme["color-primary-600"]}
                      width={25}
                      height={25}
                    />
                  </TouchableOpacity>
                </View>

                {order.memoTag ? (
                  <>
                    <Text category="h6">{order.currency} Address Memo/Tag</Text>
                    <Text category="s1">{order.memoTag}</Text>
                  </>
                ) : (
                  <></>
                )}
              </View>
            </View>
          </>
        )}

        <View style={{ paddingHorizontal: 15 }}>
          <Button
            size="giant"
            onPress={async () => {
              await Clipboard.setString(order.reference);
              alert.success("Reference Number Copied To Clipboard");
            }}
          >
            Copy reference
          </Button>
        </View>
      </ScrollView>
    </ModalContainer>
  );
}

const Time = ({ children }) => {
  const [ticker, setTicker] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setTicker(Date.now()), 2000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  var sec_num = parseInt(
    differenceInSeconds(new Date(), fromUnixTime(children)),
    10
  );

  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - hours * 3600) / 60);
  var seconds = sec_num - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  return hours + ":" + minutes + ":" + seconds;
};
