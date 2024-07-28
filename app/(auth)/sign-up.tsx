import { router } from "expo-router";
import { Button, Text, TouchableOpacity, View } from "react-native";

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
	/*const configureGoogleSignIn = () => {
		GoogleSignin.configure({
			webClientId:
				"760902025608-t4bm5brk18pr1rppgre8or8ddlt4lg73.apps.googleusercontent.com",
			iosClientId:
				"760902025608-sllt5hmnc3pf6svmdock93i401tt2llg.apps.googleusercontent.com",
		});
	};

	useEffect(() => {
		configureGoogleSignIn();
	}, []);*/

	const { session, isLoading, signIn, signInWithGoogleReq } = useSession();
	const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

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

	const [error, setError] = useState<any>();

	const submitLogin = async () => {
        setFirstName({
            value: firstName.value,
            error: ""
        })

        setLastName({
            value: lastName.value,
            error: ""
        })

        setEmail({
            value: email.value,
            error: ""
        })

        setPassword({
            value: password.value,
            error: ""
        })

        setConfirmPassword({
            value: confirmPassword.value,
            error: ""
        })

		if (!email.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
			return setError("Please set a valid email");
		}

        if (email.value.length >= 64) {
			return setError("Doesn't find any account for this email/password");
		}

		if (password.value.length < 8) {
			return setError("Doesn't find any account for this email/password");
		}

		const valid = await signIn(email, password);

		console.log("valid : ", valid);

		if (!valid) {
			console.log("not valid");
			return setError("Doesn't find any account for this email/password");
		}

		return;
	};

	const router = useRouter();

	return (
		<SafeAreaView style={styles.screen}>
			<View style={styles.container}>
				<Text style={styles.title}>Register</Text>
				<View
					style={{
						display: "flex",
						flexDirection: "row",
					}}
				>
					<CustomTextInput
						label="Firstname"
						error={firstName.error}
						styleView={{
							flex: 1,
							width: "100%",
							paddingRight: 5,
						}}
						onChangeText={(text: string) => {
							setFirstName({
								value: text,
								error: email?.error,
							});
						}}
						value={firstName.value}
					/>
					<CustomTextInput
						label="Lastname"
						error={lastName.error}
						styleView={{
							flex: 1,
							width: "100%",
							paddingLeft: 5,
						}}
						onChangeText={(text: string) => {
							setLastName({
								value: text,
								error: email?.error,
							});
						}}
						value={email.value}
					/>
				</View>
				<CustomTextInput
					label="Email"
					error={error}
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
									showPassword
										? "eye-off-outline"
										: "eye-outline"
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

				<CustomButton onPress={submitLogin}>Login</CustomButton>

				<Divider />

				<GoogleButton
					style={{
						marginTop: 10,
					}}
				/>
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
