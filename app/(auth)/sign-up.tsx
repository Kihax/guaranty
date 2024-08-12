import { router } from "expo-router";
import {
	Button,
	KeyboardAvoidingView,
	Text,
	TouchableOpacity,
	View,
	Platform,
} from "react-native";

import { useSession } from "../../auth/ctx";
import { SafeAreaView } from "react-native-safe-area-context";

import { useEffect, useState } from "react";

import { StyleSheet } from "react-native";

import { useRouter, useFocusEffect } from "expo-router";
import TextInput from "@/components/CustomTextInput";
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

	const [userGoogleInfo, setUserGoogleInfo] = useState<any>();

	const { session, isLoading, signIn, signInWithGoogleReq, signUp } = useSession();
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [showConfirmPassword, setShowConfirmPassword] =
		useState<boolean>(false);

	const handleState = () => {
		setShowPassword((showState) => {
			return !showState;
		});
	};

	const [firstName, setFirstName] = useState({
		value: "",
		error: "",
	});

	const [lastName, setLastName] = useState({
		value: "",
		error: "",
	});

	const [email, setEmail] = useState({
		value: "",
		error: "",
	});

	const [password, setPassword] = useState({
		value: "",
		error: "",
	});

	const [confirmPassword, setConfirmPassword] = useState({
		value: "",
		error: "",
	});

	const signInWithGoogle = async () => {
		try {
			await GoogleSignin.hasPlayServices();
			const userInfo = await GoogleSignin.signIn();
			setUserGoogleInfo(userInfo);
			const tokenB = await GoogleSignin.getTokens();
			const token = tokenB.accessToken;
			await signInWithGoogleReq(token);
		} catch (e) {}
	};

	const submitRegister = async () => {
		if (!firstName.value.match(/^[\w-\. ]{3,64}$/g)) {
			setFirstName({
				value: firstName.value,
				error: "Your firstname should only contains letters, numbers and be at least 3 chars and should not exceed 64 chars",
			});
		} else {
			setFirstName({
				value: firstName.value,
				error: "",
			});
		}

		if (!lastName.value.match(/^[\w-\. ]{3,64}$/g)) {
			setLastName({
				value: lastName.value,
				error: "Your lastname should only contains letters, numbers and be at least 3 chars and should not exceed 64 chars",
			});
		} else {
			setLastName({
				value: lastName.value,
				error: "",
			});
		}

		if (
			!email.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g) ||
			email.value.length >= 64
		) {
			setEmail({
				value: email.value,
				error: "Please set a valid email",
			});
		} else {
			setEmail({
				value: email.value,
				error: "",
			});
		}

		if (
			!password.value.match(
				/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm
			)
		) {
			setPassword({
				value: password.value,
				error: "Your password has to contains a minuscule, a majuscule, and a number and his length has to be at least 8 caracters",
			});
		} else {
			setPassword({
				value: password.value,
				error: "",
			});
		}

		if (password.value != confirmPassword.value) {
			setConfirmPassword({
				value: confirmPassword.value,
				error: "Confirm password value doesn't match with password value",
			});
		} else {
			setConfirmPassword({
				value: confirmPassword.value,
				error: "",
			});
		}

		if (
			firstName.error == "" &&
			lastName.error == "" &&
			email.error == "" &&
			password.error == "" &&
			confirmPassword.error == ""
		) {
			const r = await signUp(email.value, firstName.value, lastName.value, password.value)
		}
	};

	const router = useRouter();

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>Register</Text>
			<View
				style={{
					display: "flex",
					flexDirection: "row",
				}}
			>
				<CustomTextInput
					label="First name"
					error={firstName.error}
					styleView={{
						flex: 1,
						width: "100%",
						paddingRight: 5,
					}}
					onChangeText={(text: string) => {
						setFirstName({
							value: text,
							error: firstName?.error,
						});
					}}
					value={firstName.value}
				/>
				<CustomTextInput
					label="Last name"
					error={lastName.error}
					styleView={{
						flex: 1,
						width: "100%",
						paddingLeft: 5,
					}}
					onChangeText={(text: string) => {
						setLastName({
							value: text,
							error: lastName?.error,
						});
					}}
					value={lastName.value}
				/>
			</View>
			<CustomTextInput
				label="Email"
				error={email.error}
				onChangeText={(text: string) => {
					setEmail({
						value: text,
						error: email?.error,
					});
				}}
				value={email.value}
			/>
			<CustomTextInput
				value={password.value}
				label="Password"
				secureTextEntry={!showPassword}
				leftComponent={
					<TouchableOpacity
						onPress={() => {
							setShowPassword(!showPassword);
						}}
					>
						<Ionicons
							name={
								showPassword ? "eye-off-outline" : "eye-outline"
							}
							size={28}
						/>
					</TouchableOpacity>
				}
				onChangeText={(text: string) => {
					setPassword({
						value: text,
						error: password?.error,
					});
				}}
				error={password?.error}
			/>

			<CustomTextInput
				value={confirmPassword.value}
				label="Confirm password"
				secureTextEntry={!showConfirmPassword}
				leftComponent={
					<TouchableOpacity
						onPress={() => {
							setShowConfirmPassword(!showConfirmPassword);
						}}
					>
						<Ionicons
							name={
								showConfirmPassword
									? "eye-off-outline"
									: "eye-outline"
							}
							size={28}
						/>
					</TouchableOpacity>
				}
				onChangeText={(text: string) => {
					setConfirmPassword({
						value: text,
						error: password?.error,
					});
				}}
				error={confirmPassword?.error}
			/>

			<Text style={styles.noaccount}>
				<Link href="sign-in">Does have an account ?</Link>
			</Text>

			<CustomButton onPress={submitRegister}>Register</CustomButton>

			<Divider />

			<GoogleButton
				props={{
					onPress: signInWithGoogle,
				}}
				style={{
					marginTop: 10,
				}}
			/>
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
