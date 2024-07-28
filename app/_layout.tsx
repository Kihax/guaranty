import { Slot } from "expo-router";
import { SessionProvider } from "../auth/ctx";
import { SafeAreaView } from "react-native";

export default function Root() {
	// Set up the auth context and render our layout inside of it.
	return (
		<SessionProvider>
			<SafeAreaView style={{
				height: "100%",
				width: "100%",
				backgroundColor: "blue"
			}}>
				<Slot />
			</SafeAreaView>
		</SessionProvider>
	);
}
