import React from "react";
import { useStorageState } from "./useStorageState";
import { useRouter, useFocusEffect } from "expo-router";

const AuthContext = React.createContext<{
	signIn: (email: string, password: string) => Promise<Boolean>;
	signUp: (email: string, firstname: string, lastname: string, password: string) => Promise<Boolean>;
	signInWithGoogleReq: (accessToken: string) => void;
	signOut: () => void;
	session?: string | null;
	isLoading: boolean;
	signInGoogleAfterPassword: (token: string, password: any) => Promise<any>;
}>({
	signIn: (email: any, password: any) => new Promise<Boolean>(() => {return false}),
	signUp: (email: string, firstname: string, lastname: string, password: string) => new Promise<Boolean>(() => {return false}),
	signInWithGoogleReq: (accessToken: string) => null,
	signOut: () => null,
	session: null,
	isLoading: false,
	signInGoogleAfterPassword: (token: string, password: any) => new Promise<any>(() => {return {}}),
});

// This hook can be used to access the user info.
export function useSession() {
	const value = React.useContext(AuthContext);
	if (process.env.NODE_ENV !== "production") {
		if (!value) {
			throw new Error(
				"useSession must be wrapped in a <SessionProvider />"
			);
		}
	}

	return value;
}

const URL_API_AUTH = `${process.env.EXPO_PUBLIC_BASE_URL}/auth`;

export function SessionProvider(props: React.PropsWithChildren) {
	const [[isLoading, session], setSession] = useStorageState("session");
	const router = useRouter();

	const signIn = async (email: any, password: any) => {
		// Perform sign-in logic here
		console.log("sign in");
		try {
			const response = await fetch(`${URL_API_AUTH}/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: email,
					password: password,
				}),
			});

			console.log(response)

			if (response.ok) {
				const res = await response.json();
				console.log(res);
				if (res?.token?.token) {
					setSession(res.token.token);
					router.replace("(app)/index");
					return true;
				}
			} else {
				console.error("Promise resolved but HTTP status failed");
			}
			return false;
		} catch (e) {
			console.log(e);
			return false;
		}
	};

	const signInGoogleAfterPassword = async (token: string, password: string) => {
		const response = await fetch(
			`${URL_API_AUTH}/googleSetPassword/${token}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					password: password,
				}),
			}
		);
		console.log(password);
		const res = await response.json();
		console.log(res);
		if (res?.token) {
			setSession(res.token.token);
			router.replace("./(app)");
			return {

			}
		} else {
			return {
				error: "an error occured"
			}
		}
	};

	const signInWithGoogleReq = async (accessToken: string) => {
		// Perform sign-in logic here
		const response = await fetch(
			`${URL_API_AUTH}/login/google/${accessToken}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
			}
		);
		const res = await response.json();
		console.log(res)
		if (res?.code == 2) {
			router.replace({
				pathname: "create-password",
				params: {
					token: res?.token
				}
			});
		}
		if (res?.token) {
			setSession(res.token);
			router.replace("/");
		}
	};

	const signUp = async (email: string, firstname: string, lastname: string, password: string) => {
		const response = await fetch(`${URL_API_AUTH}/register`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email,
				firstname,
				lastname,
				password,
			}),
		});
		console.log(response)
		const res = await response.json();
		console.log(res)
		if (res?.error) {
			return false
		} else {
			await signIn(email, password);
		}
		return true
		//await signIn(email, password)
	};

	return (
		<AuthContext.Provider
			value={{
				signIn,
				signUp,
				signOut: () => {
					setSession(null);
				},
				signInWithGoogleReq,
				session,
				isLoading,
				signInGoogleAfterPassword,
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
}
