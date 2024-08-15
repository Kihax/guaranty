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

export default function SignIn() {
	const { session, isLoading, signIn, signInWithGoogleReq } = useSession();
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [showConfirmPassword, setShowConfirmPassword] =
		useState<boolean>(false);

	const handleState = () => {
		setShowPassword((showState) => {
			return !showState;
		});
	};

	const [password, setPassword] = useState({
		value: "",
		error: "",
	});

	const [confirmPassword, setConfirmPassword] = useState({
		value: "",
		error: "",
	});

	const submitRegister = () => {
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

		return;
	};

	const router = useRouter();

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>Forgot password</Text>

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
