import { router } from "expo-router";
import { Text, View } from "react-native";

import { useSession } from "../../auth/ctx";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignIn() {
	const { signIn } = useSession();
	return (
        <SafeAreaView>
		<View
			style={{ 
                width: "100%",
                height: "100%",
                backgroundColor: "white"
             }}
		>
			<Text
				onPress={() => {
					signIn("test", "password");
					console.log(process.env.EXPO_PUBLIC_BASE_URL);
					// Navigate after signing in. You may want to tweak this to ensure sign-in is
					// successful before navigating.
					router.replace("/");
				}}
			>
				Sign In
			</Text>
		</View>
        </SafeAreaView>
	);
}
