import React, { useState, useEffect } from "react";
import {
	createClient,
	ClientContextProvider,
	useQuery,
	useMutation,
	useParameterizedQuery,
} from "react-fetching-library";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { useAlert } from "react-alert";
import * as Validator from "validatorjs";
const addressValidator = require("@swyftx/api-crypto-address-validator");

const contextInitial = {
	settings: {},
	currencies: [],
	currency: null,
	loadingCurrencies: true,
	loadingSettings: true,
	setCurrency: (currency) => {},
	buyCrypto: () => {
		return {
			status: false,
		};
	},
	sellCrypto: () => {
		return {
			status: false,
		};
	},
	resolveAccount: () => {
		return {
			status: false,
		};
	},
	searchOrder: () => {
		return {
			status: false,
		};
	},
	order: null,
	loadingAccountResolve: false,
	loadingBuyRequest: false,
	loadingGetOrder: false,
	loadingSellRequest: false,
};

export const MainApiContext = React.createContext(contextInitial);
const fpPromise = FingerprintJS.load();

export const protocol = "https";
export const domain = "4givhabcp4.sharedwithexpose.com";

export const requestHostInterceptor = () => (client) => async (action) => {
	const fp = await fpPromise;
	const result = await fp.get();
	return {
		...action,
		endpoint: `${protocol}://${domain}/api/v${action.endpoint}`,
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"Vendor-Host": location.hostname,
			"Vendor-Visitor": result.visitorId,
		},
	};
};

const client = createClient({
	requestInterceptors: [requestHostInterceptor()],
	responseInterceptors: [],
});

const getSettings = {
	method: "GET",
	endpoint: "/settings",
};

const getCurrencies = {
	method: "GET",
	endpoint: "/currencies",
};

const postBuyRequest = (body) => ({
	method: "POST",
	endpoint: "/buy",
	body,
});

const postSellRequest = (body) => ({
	method: "POST",
	endpoint: "/sell",
	body,
});

const postResolveAccount = (body) => ({
	method: "POST",
	endpoint: "/resolve-account",
	body,
});

const getOrder = (order) => ({
	method: "GET",
	endpoint: "/orders/" + order,
});

function ApiContext_({ children }) {
	const [settings, setSettings] = useState({});
	const [currencies, setCurrencies] = useState([]);
	const [currency, setCurrency] = useState(null);
	const [order, setOrder] = useState(null);

	const alert = useAlert();

	const {
		loading: loadingSettings,
		payload: settingsPayload,
		error,
	} = useQuery(getSettings, true);

	const { loading: loadingCurrencies, payload: currenciesPayload } = useQuery(
		getCurrencies,
		true
	);

	const { loading: loadingBuyRequest, mutate: sendBuyRequest } =
		useMutation(postBuyRequest);

	const { loading: loadingSellRequest, mutate: sendSellRequest } =
		useMutation(postSellRequest);

	const { loading: loadingAccountResolve, mutate: resolveAccountMutate } =
		useMutation(postResolveAccount);

	const { loading: loadingGetOrder, query: queryGetOrder } =
		useParameterizedQuery(getOrder);

	useEffect(() => {
		if (settingsPayload?.name) {
			setSettings(settingsPayload);
		}
	}, [settingsPayload]);

	useEffect(() => {
		if (currenciesPayload?.length >= 1) {
			setCurrencies(currenciesPayload);
		}
	}, [currenciesPayload]);

	useEffect(() => {
		if (error && settingsPayload?.message == "vendor not found") {
			window.location = `${protocol}://${domain}/ks/app`;
		}
	}, [error]);

	const buyCrypto = async ({
		amount,
		address,
		bank,
		accountNumber,
		isFiat,
		cryptoAmount,
		memoTag,
		phoneNumber,
		network,
	}) => {
		if (!addressValidator.validate(address, currency.currency)) {
			return alert.error(
				"Please enter a valid " + currency.display_name + " address"
			);
		}

		const validator = new Validator(
			{
				amount,
				address,
				bank,
				accountNumber,
				isFiat,
				memoTag,
				phoneNumber,
				network,
			},
			{
				amount: "required|numeric|min:1000",
				address: "required|alpha_num",
				bank: "required",
				accountNumber: "required|min:10|max:10",
				phoneNumber: "required|min:11|max:11",
				memoTag: "min:1|max:25",
				network: "required",
			},
			{
				"required.amount": "Kindly enter a valid amount",
				"min.amount": "Kindly enter an amount above NGN 1000",
				"required.address": "Kindly enter a valid address",
				"alpha_num.address": "Kindly enter a valid address",
				"required.bank": "Kindly select a valid bank",
				"required.accountNumber": "Kindly enter a valid account number",
				"min.accountNumber":
					"Account account number must be 10 numbers",
				"max.accountNumber":
					"Account account number must be 10 numbers",
				"required.phoneNumber": "Please enter a valid phone number",
				"min.phoneNumber": "Phone number must be 11 numbers",
				"max.phoneNumber": "Phone number must be 11 numbers",
				"required.network": "Kindly enter a valid network",
			}
		);

		if (validator.fails()) {
			alert.error(
				validator.errors.first(Object.keys(validator.errors.all())[0])
			);
			return {
				status: false,
			};
		}
		const { payload: buyRequestPayload } = await sendBuyRequest({
			amount: cryptoAmount,
			address,
			bank,
			account_number: accountNumber,
			is_fiat: isFiat,
			currency: currency.currency,
			memoTag,
			phone_number: phoneNumber,
			network,
		});

		if (buyRequestPayload?.reference) {
			setOrder(buyRequestPayload);
			return {
				status: true,
			};
		}

		if (buyRequestPayload.errors) {
			alert.error(
				buyRequestPayload.errors[
					Object.keys(buyRequestPayload.errors)[0]
				][0]
			);
		}

		if (buyRequestPayload.message == "Vendor cannont receive payments") {
			alert.error("Can't receive payments, kindly contact support.");
		}

		return {
			status: false,
		};
	};

	const sellCrypto = async ({
		amount,
		bank,
		accountNumber,
		isFiat,
		cryptoAmount,
		phoneNumber,
		network,
	}) => {
		const validator = new Validator(
			{
				amount,
				bank,
				accountNumber,
				isFiat,
				phoneNumber,
				network,
			},
			{
				amount: "required|numeric|min:1000",
				bank: "required",
				accountNumber: "required|min:10|max:10",
				phoneNumber: "min:11|max:11",
				network: "required",
			},
			{
				"required.amount": "Please enter a valid amount",
				"min.amount": "Please enter an amount above NGN 1000",
				"required.bank": "Please select a valid bank",
				"required.accountNumber": "Please enter a valid account number",
				"min.accountNumber":
					"Account account number must be 10 numbers",
				"max.accountNumber":
					"Account account number must be 10 numbers",
				"required.phoneNumber": "Please enter a valid phone number",
				"min.phoneNumber": "Phone number must be 11 numbers",
				"max.phoneNumber": "Phone number must be 11 numbers",
				"required.network": "Kindly enter a valid network",
			}
		);

		if (validator.fails()) {
			alert.error(
				validator.errors.first(Object.keys(validator.errors.all())[0])
			);
			return {
				status: false,
			};
		}
		const { payload: buyRequestPayload } = await sendSellRequest({
			amount: cryptoAmount,
			bank,
			account_number: accountNumber,
			is_fiat: isFiat,
			currency: currency.currency,
			phone_number: phoneNumber,
			network,
		});

		if (buyRequestPayload?.reference) {
			setOrder(buyRequestPayload);
			return {
				status: true,
			};
		}

		if (buyRequestPayload.errors) {
			alert.error(
				buyRequestPayload.errors[
					Object.keys(buyRequestPayload.errors)[0]
				][0]
			);
		}

		return {
			status: false,
		};
	};

	const resolveAccount = async ({ bank, accountNumber }) => {
		const { payload: accountResolvePayload } = await resolveAccountMutate({
			bank,
			account_number: accountNumber,
		});

		if (!accountResolvePayload) {
			return {
				name: "",
				status: false,
			};
		}

		if (!accountResolvePayload["status"]) {
			return {
				name: "",
				status: false,
			};
		}

		return {
			name: accountResolvePayload.data.account_name,
			status: true,
		};
	};

	const searchOrder = async (orderId) => {
		const { payload: getOrderPayload } = await queryGetOrder(orderId);

		if (!getOrderPayload) {
			// Get Order payload
			return {
				status: false,
			};
		}

		if (!getOrderPayload["reference"]) {
			// Get Order payload
			return {
				status: false,
			};
		}

		if (getOrderPayload?.reference) {
			setOrder(getOrderPayload);
			return {
				status: true,
			};
		}

		return {
			status: true,
		};
	};

	return (
		<MainApiContext.Provider
			value={{
				settings,
				currencies,
				currency,
				setCurrency,
				loadingSettings,
				loadingCurrencies,
				buyCrypto,
				sellCrypto,
				resolveAccount,
				searchOrder,
				loadingAccountResolve,
				order,
				loadingBuyRequest,
				loadingSellRequest,
				loadingGetOrder,
			}}
		>
			{children}
		</MainApiContext.Provider>
	);
}

export default function ApiContext({ children }) {
	return (
		<ClientContextProvider client={client}>
			<ApiContext_>{children}</ApiContext_>
		</ClientContextProvider>
	);
}
