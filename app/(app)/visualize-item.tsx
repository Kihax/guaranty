import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import ImageToken from "@/components/ImageToken";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const visualizeItem = () => {
	const { token } = useLocalSearchParams<{ token: string }>();
    const router = useRouter()
	return (
		<SafeAreaView
			style={{
				height: "100%",
				width: "100%",
				position: "relative",
			}}
		>
			<View style={{
                height: "100%",
				width: "100%",
                display: "flex",
				alignContent: "center",
				justifyContent: "center",
            }}>
				<TouchableOpacity
					style={{
						position: "absolute",
						top: 10,
						left: 10,
						padding: 15,
						backgroundColor: "#4b4b4b",
						borderRadius: 100,
                        zIndex: 2
					}}
                    onPress={() => {
                        console.log("salut")
                        router.back()
                    }}
				>
					<Ionicons name="arrow-back-sharp" size={24} color="white" />
				</TouchableOpacity>
				<ImageToken
					style={{
						width: "100%",
						height: "100%",
					}}
					resizeMode="contain"
					token={token}
					type="ticket"
				/>
			</View>
		</SafeAreaView>
	);
};

export default visualizeItem;
