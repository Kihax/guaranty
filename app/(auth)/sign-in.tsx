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

	const handleState = () => {
		setShowPassword((showState) => {
			return !showState;
		});
	};

	const [email, setEmail] = useState("victor@gmail.com");

	const [password, setPassword] = useState("motdepasse1234");

	const [error, setError] = useState<any>();
	const [userGoogleInfo, setUserGoogleInfo] = useState<any>();

	const submitLogin = async () => {

        if(!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)){
            return setError("Doesn't find any account for this email/password")
        }


        if(password.length < 8){
            return setError("Doesn't find any account for this email/password")
        }


        const valid = await signIn(email, password);

        console.log("valid : ", valid)

        if(!valid){
            console.log("not valid")
            return setError("Doesn't find any account for this email/password")
        }

        return;
    };

	/*const signInWithGoogle = async () => {
		console.log("pressed");

		try {
			await GoogleSignin.hasPlayServices();
			const userInfo = await GoogleSignin.signIn();
			setUserGoogleInfo(userInfo);
			const tokenB = await GoogleSignin.getTokens();
			const token = tokenB.accessToken;
			await signInWithGoogleReq(token);
		} catch (e) {
			setError(e);
		}
	};*/

	const router = useRouter();

	return (
		<SafeAreaView style={styles.screen}>
			<View style={styles.container}>
				<Text style={styles.title}>Login</Text>
				<CustomTextInput
					label="Email"
					error={error}
					onChangeText={(text: string) => {
						setEmail(text);
					}}
                    value={email}
				/>
				<CustomTextInput
                    value={password}
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
						setPassword(text);
					}}
				/>

				<Text style={styles.forgot}>
					<Link href="forgot-password">Forgot password ?</Link>
				</Text>

				<CustomButton onPress={submitLogin}>Login</CustomButton>

				<Text style={styles.noaccount}>
					<Link href="sign-up">Doesn't have an account ?</Link>
				</Text>

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
