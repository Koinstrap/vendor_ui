import React, { useState, useContext, useEffect } from "react";
import {
  TouchableOpacity,
  View,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import {
  Text,
  Icon,
  useTheme,
  Button,
  Divider,
  Select,
  SelectItem,
  Input,
  Spinner,
} from "@ui-kitten/components";
import Clipboard from "expo-clipboard";

import ModalContainer from "./components/ModalContainer";
import useScreenSize from "../hooks/useScreenSize";
import { useAlert } from "react-alert";
import { MainApiContext } from "../contexts/ApiContexts";

export default function SellScreen({ navigation }) {
  const theme = useTheme();
  const small = useScreenSize();
  const alert = useAlert();
  const {
    currency,
    sellCrypto,
    settings,
    resolveAccount,
    loadingAccountResolve,
    loadingSellRequest,
  } = useContext(MainApiContext);

  const [isFiat, setIsFiat] = useState(true);
  const [amount, setAmount] = useState("0.00");
  const [cryptoAmount, setCryptoAmount] = useState("0.00");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bank, setBank] = useState("");
  const [selectBankIndex, setSelectBankIndex] = useState();
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [currencyNetwork, setCurrencyNetwork] = useState(
    currency.networks.length >= 2 ? "" : currency.networks[0]
  );

  useEffect(() => {
    if (isFiat) {
      setCryptoAmount(amount / currency.fiat_buy_price);
    }
    if (!isFiat) {
      setAmount(cryptoAmount * currency.fiat_buy_price);
    }
  }, [isFiat, amount, cryptoAmount]);

  const onClickProceedToPayment = async () => {
    if (!accountName) {
      return alert.error("Please enter valid account details");
    }
    if (!currencyNetwork) {
      return alert.error("Please select a newtork");
    }

    const { status } = await sellCrypto({
      amount,
      bank,
      accountNumber,
      isFiat,
      cryptoAmount,
      phoneNumber,
      network: currencyNetwork,
    });

    if (status) {
      navigation.replace("Overview");
    }
  };

  const onResolveAccount = async () => {
    const { name, status } = await resolveAccount({
      bank,
      accountNumber,
    });

    if (status) {
      setAccountName(name);
    }
  };

  useEffect(() => {
    if (accountNumber.length >= 10) {
      onResolveAccount();
    } else {
      setAccountName("");
    }
  }, [bank, accountNumber]);

  useEffect(() => {
    setAccountName("");
  }, [bank]);

  useEffect(() => {
    if (selectBankIndex) {
      setBank(settings.banks[selectBankIndex.row].code);
    }
  }, [selectBankIndex]);

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
          <Text category="h6">What do you want to do?</Text>

          {!loadingSellRequest && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.goBack()}
            >
              <Icon
                name="close-circle-outline"
                height={30}
                width={30}
                fill={theme["color-basic-700"]}
              />
            </TouchableOpacity>
          )}
        </View>
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 15,
            marginBottom: 20,
          }}
        >
          <View style={{ width: small ? 125 : 175 }}>
            <Button
              style={{ borderRadius: 400 }}
              size={small ? "medium" : "giant"}
            >
              SELL {currency.currency}
            </Button>
          </View>
          <View style={{ width: 25 }} />
          <View style={{ width: small ? 125 : 175 }}>
            <Button
              style={{ backgroundColor: "transparent", borderRadius: 400 }}
              size={small ? "medium" : "giant"}
              appearance="outline"
              onPress={() => navigation.replace("Buy")}
            >
              BUY {currency.currency}
            </Button>
          </View>
        </View>
        <Divider />
        <View style={{ paddingHorizontal: 15, marginVertical: 20 }}>
          <View style={{ marginBottom: 5 }}>
            <Text category="s1">How much do you want to sell?</Text>
          </View>

          <View>
            <Input
              style={{
                borderWidth: 1,
                borderColor: theme["color-primary-600"],
                borderRadius: 5,
              }}
              value={isFiat ? amount : cryptoAmount}
              onChangeText={(text) => {
                if (isFiat) {
                  setAmount(text);
                }

                if (!isFiat) {
                  setCryptoAmount(text);
                }
              }}
              keyboardType="decimal-pad"
              accessoryRight={() => {
                if (isFiat) {
                  return <></>;
                }
                return (
                  <Text status="primary" category="label">
                    {currency.currency}
                  </Text>
                );
              }}
              accessoryLeft={() => {
                if (!isFiat) {
                  return <></>;
                }
                return (
                  <Text status="primary" category="label">
                    NGN
                  </Text>
                );
              }}
              size="large"
              placeholder="Enter amount"
            />
          </View>

          <View
            style={{
              marginTop: 5,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text category="s2">
              ~{" "}
              {isFiat
                ? `${Number(cryptoAmount).toFixed(8)} ${currency.currency}`
                : `NGN ${amount.toLocaleString()}`}
            </Text>
            <TouchableOpacity onPress={() => setIsFiat(!isFiat)}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <View style={{ marginRight: 2 }}>
                  <Text category="label" status="danger">
                    {isFiat ? "By Crypto" : "By Cash"}
                  </Text>
                </View>
                <Icon
                  name="swap-outline"
                  width={15}
                  height={15}
                  fill={theme["color-danger-600"]}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 15 }}>
            <View style={{ marginBottom: 5 }}>
              <Text category="s1">Select Network</Text>
            </View>

            <Select
              disabled={currency.networks.length === 1}
              size="large"
              placeholder="Select a Network"
              style={{
                borderWidth: 1,
                borderColor: theme["color-primary-600"],
                borderRadius: 5,
              }}
              value={currencyNetwork}
              onSelect={(index) =>
                setCurrencyNetwork(currency.networks[index.row])
              }
              selectedIndex={selectBankIndex}
            >
              {currency.networks.map((network) => (
                <SelectItem title={network} key={network} />
              ))}
            </Select>
          </View>
        </View>

        <Divider />

        <View style={{ paddingHorizontal: 15, paddingVertical: 25 }}>
          <Text category="s1">Receiving Account Details</Text>

          <View style={{ height: 5 }} />

          <Text category="p2">
            Kindly provide the bank account details where you want to receive
            money for your crypto.
          </Text>
        </View>

        <View style={{ paddingHorizontal: 15 }}>
          <View style={{ marginTop: 10, marginBottom: 15 }}>
            <View style={{ marginBottom: 5 }}>
              <Text category="s1">Phone Number</Text>
            </View>

            <View>
              <Input
                value={phoneNumber}
                onChangeText={(e) => setPhoneNumber(e)}
                style={{
                  borderWidth: 1,
                  borderColor: theme["color-primary-600"],
                  borderRadius: 5,
                }}
                size="large"
                placeholder="Enter phone number"
              />
            </View>
          </View>
          {small ? (
            <>
              {" "}
              <View style={{ flex: 1, paddingVertical: 15 }}>
                <View style={{ marginBottom: 5 }}>
                  <Text category="s1">Select Bank</Text>
                </View>

                <Select
                  size="large"
                  placeholder="Select a Bank"
                  style={{
                    borderWidth: 1,
                    borderColor: theme["color-primary-600"],
                    borderRadius: 5,
                  }}
                  value={(settings?.banks ?? [])[selectBankIndex - 1]?.name}
                  onSelect={(index) => setSelectBankIndex(index)}
                  selectedIndex={selectBankIndex}
                >
                  {settings.banks.map((bank) => (
                    <SelectItem title={bank.name} key={bank.name} />
                  ))}
                </Select>
              </View>
              <View style={{ flex: 1, paddingVertical: 15 }}>
                <View style={{ marginBottom: 5 }}>
                  <Text category="s1">Account Number</Text>
                </View>

                <Input
                  style={{
                    borderWidth: 1,
                    borderColor: theme["color-primary-600"],
                    borderRadius: 5,
                  }}
                  size="large"
                  value={accountNumber}
                  placeholder="Enter account number"
                  onChangeText={(e) => setAccountNumber(e)}
                  accessoryRight={() => {
                    if (!loadingAccountResolve) {
                      return <></>;
                    }
                    return <Spinner size="tiny" status="success" />;
                  }}
                />
              </View>
            </>
          ) : (
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                <View style={{ marginBottom: 5 }}>
                  <Text category="s1">Select Bank</Text>
                </View>

                <Select
                  size="large"
                  placeholder="Select a Bank"
                  style={{
                    borderWidth: 1,
                    borderColor: theme["color-primary-600"],
                    borderRadius: 5,
                  }}
                  value={(settings?.banks ?? [])[selectBankIndex - 1]?.name}
                  onSelect={(index) => setSelectBankIndex(index)}
                  selectedIndex={selectBankIndex}
                >
                  {settings.banks.map((bank) => (
                    <SelectItem title={bank.name} key={bank.name} />
                  ))}
                </Select>
              </View>

              <View style={{ width: 10 }} />

              <View style={{ width: 240 }}>
                <View style={{ marginBottom: 5 }}>
                  <Text category="s1">Account Number</Text>
                </View>

                <Input
                  style={{
                    borderWidth: 1,
                    borderColor: theme["color-primary-600"],
                    borderRadius: 5,
                  }}
                  size="large"
                  value={accountNumber}
                  placeholder="Enter account number"
                  onChangeText={(e) => setAccountNumber(e)}
                  accessoryRight={() => {
                    if (!loadingAccountResolve) {
                      return <></>;
                    }
                    return <Spinner size="tiny" status="success" />;
                  }}
                />
              </View>
            </View>
          )}

          <View style={{ flex: 1, paddingVertical: 15 }}>
            <View style={{ marginBottom: 5 }}>
              <Text category="s1">Account Name</Text>
            </View>

            <Input
              style={{
                borderWidth: 1,
                borderColor: theme["color-primary-600"],
                borderRadius: 5,
              }}
              size="large"
              value={accountName}
              placeholder="Enter full account name"
              editable={false}
            />
          </View>

          <View style={{ paddingTop: 15 }}>
            <Button
              size="giant"
              onPress={() => {
                if (loadingSellRequest) {
                  return;
                }
                onClickProceedToPayment();
              }}
              accessoryLeft={() => {
                if (!loadingSellRequest) {
                  return <></>;
                }

                return <Spinner size="small" status="control" />;
              }}
            >
              {loadingSellRequest ? "Processing" : "Proceed to Payment"}
            </Button>
          </View>
        </View>
      </ScrollView>
    </ModalContainer>
  );
}
