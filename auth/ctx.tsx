import React from "react";
import { useStorageState } from "./useStorageState";
import { useRouter, useFocusEffect } from "expo-router";

const AuthContext = React.createContext<{
	signIn: (email: any, password: any) => Promise<Boolean>;
	signUp: (email: any, fullName: any, password: any) => void;
	signInWithGoogleReq: (accessToken: string) => void;
	signOut: () => void;
	session?: string | null;
	isLoading: boolean;
	signInGoogleAfterPassword: (token: string, password: any) => void;
}>({
	signIn: (email: any, password: any) => new Promise<Boolean>(() => {return false}),
	signUp: (email: any, fullName: any, password: any) => null,
	signInWithGoogleReq: (accessToken: string) => null,
	signOut: () => null,
	session: null,
	isLoading: false,
	signInGoogleAfterPassword: (token: string, password: any) => null,
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

			if (response.ok) {
				const res = await response.json();
				console.log(res);
				if (res?.token?.token) {
					setSession(res.token.token);
					router.replace("/");
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

	const signInGoogleAfterPassword = async (token: string, password: any) => {
		const response = await fetch(
			`${URL_API_AUTH}/googleSetPassword/${token}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					password: password?.password.value,
				}),
			}
		);
		console.log(password);
		const res = await response.json();
		console.log(res);
		if (res?.token?.token) {
			setSession(res.token.token);
			router.replace("/");
		} else {
			password.setPassword({
				value: password.password?.value,
				error: res?.message || "erreur",
			});
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
		console.log(res);
		if (res?.code == 10) {
			router.replace(`create-password?token=${res?.token}`);
		}
		if (res?.token?.token) {
			setSession(res.token.token);
			router.replace("/");
		}
	};

	const signUp = async (email: any, fullName: any, password: any) => {
		const response = await fetch(`${URL_API_AUTH}/register`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: email.email.value,
				fullName: fullName.fullName.value,
				password: password.password.value,
			}),
		});
		const res = await response.json();
		if (res?.error) {
			for (let i = 0; i < res.error.len; i++) {
				if (res?.error[i]?.field == "password") {
					password.setPassword({
						value: password.password.value,
						error: res?.errors[0]?.message || "",
					});
				} else if (res?.error[0]?.field == "email") {
					email.setEmail({
						value: email.email.value,
						error: res?.errors[0]?.message || "",
					});
				} else if (res?.error[0]?.field == "fullName") {
					fullName.setFullName({
						value: fullName.fullName.value,
						error: res?.errors[0]?.message || "",
					});
				}
			}
		} else {
			signIn(email, password);
		}

		//await signIn(email, password)
	};

	return (
		<AuthContext.Provider
			value={{
				signIn: signIn,
				signUp: signUp,
				signOut: () => {
					setSession(null);
				},
				signInWithGoogleReq: signInWithGoogleReq,
				session,
				isLoading,
				signInGoogleAfterPassword,
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
}
