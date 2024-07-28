import React from "react";
import { useStorageState } from "./useStorageState";
import { useRouter, useFocusEffect } from "expo-router";

const AuthContext = React.createContext<{
	signIn: (email: any, password: any) => void;
	signUp: (email: any, fullName: any, password: any) => void;
	signInWithGoogleReq: (accessToken: string) => void;
	signOut: () => void;
	session?: string | null;
	isLoading: boolean;
	signInGoogleAfterPassword: (token: string, password: any) => void;
}>({
	signIn: (email: any, password: any) => null,
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

const URL_API = "https://192.168.1.14:3333/api/auth";

export function SessionProvider(props: React.PropsWithChildren) {
	const [[isLoading, session], setSession] = useStorageState("session");
	const router = useRouter();

	const signIn = async (email: any, password: any) => {
		// Perform sign-in logic here
		const response = await fetch(`${URL_API}/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: email.email.value,
				password: password.password.value,
			}),
		});
		const res = await response.json();
		if (res?.token?.token) {
			setSession(res.token.token);
			router.replace("/");
		} else {
			email.setEmail({
				value: email.email.value,
				error: res?.errors[0]?.message || "",
			});
		}
	};

	const signInGoogleAfterPassword = async (token: string, password: any) => {
		const response = await fetch(
			`http://192.168.1.14:3333/api/auth/googleSetPassword/${token}`,
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
    console.log(password)
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
		const response = await fetch(`${URL_API}/login/google/${accessToken}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
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
		const response = await fetch(`${URL_API}/register`, {
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
