import { router } from "expo-router";
import { Button, Text, TouchableOpacity, View } from "react-native";

import { useSession } from "../../auth/ctx";
import { SafeAreaView } from "react-native-safe-area-context";

import { useEffect, useState } from "react";

import { StyleSheet } from "react-native";

import { useRouter, useFocusEffect } from "expo-router";
import CustomTextInput from "@/components/CustomTextInput";
import Ionicons from "@expo/vector-icons/Ionicons";
import CustomButton from "@/components/CustomButton";
import Divider from "@/components/Divider";
import GoogleButton from "@/components/GoogleButton";
import { Link } from "expo-router";
import {
	GoogleSignin,
	GoogleSigninButton,
	statusCodes,
} from "@react-native-google-signin/google-signin";

const URL_API_AUTH = `${process.env.EXPO_PUBLIC_BASE_URL}/auth`;

export default function SignIn() {
	const configureGoogleSignIn = () => {
		GoogleSignin.configure({
			webClientId:
				"760902025608-t4bm5brk18pr1rppgre8or8ddlt4lg73.apps.googleusercontent.com",
			iosClientId:
				"760902025608-sllt5hmnc3pf6svmdock93i401tt2llg.apps.googleusercontent.com",
		});
	};

	useEffect(() => {
		configureGoogleSignIn();
	}, []);

	const { session, isLoading, signIn, signInWithGoogleReq } = useSession();
	const [showPassword, setShowPassword] = useState<boolean>(false);

	const handleState = () => {
		setShowPassword((showState) => {
			return !showState;
		});
	};

	const [email, setEmail] = useState<String>("");
	const [error, setError] = useState<any>();
	const [message, setMessage] = useState<String>("");

	const submitForgotPassword = async () => {
		if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
			return setError("Doesn't find any account for this email/password");
		}

		const response = await fetch(`${URL_API_AUTH}/password/send`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: email,
			}),
		});
		if (response.ok) {
			const res = await response.json();
			setMessage("You will receive an email soon, if your account exist")
		} else {
			console.error("Promise resolved but HTTP status failed");
		}
	};

	const router = useRouter();

	return (
		<SafeAreaView style={styles.screen}>
			<View style={styles.container}>
				<Text style={styles.title}>Forgot password</Text>
				<CustomTextInput
					label="Email"
					error={error}
					onChangeText={(text: string) => {
						setEmail(text);
					}}
					value={email}
				/>

				<Text>{message}</Text>

				<CustomButton onPress={submitForgotPassword}>Send</CustomButton>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	screen: {
		backgroundColor: "blue",
		height: "100%",
		width: "100%",
	},
	container: {
		backgroundColor: "white",
		height: "100%",
		width: "100%",
		paddingHorizontal: 20,
		paddingTop: 10,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
	forgot: {
		textAlign: "right",
		marginVertical: 10,
		fontWeight: "600",
	},
	noaccount: {
		marginVertical: 10,
		fontWeight: "600",
	},
});
