import { Slot } from "expo-router";
import { SessionProvider } from "../auth/ctx";
import { KeyboardAvoidingView, SafeAreaView, Platform } from "react-native";
import { Text } from "react-native";

export default function Root() {
	// Set up the auth context and render our layout inside of it.
	return (
		<SessionProvider>
			<SafeAreaView>
				<Slot />
			</SafeAreaView>
		</SessionProvider>
	);
}
