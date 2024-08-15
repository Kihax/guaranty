import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import ImageToken from "@/components/ImageToken";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";
import { useRouter } from "expo-router";
import Feather from '@expo/vector-icons/Feather';
import { useSession } from "@/auth/ctx";

/**
 * Constantes
 */
const URL_API_ITEMS = `${process.env.EXPO_PUBLIC_BASE_URL}/items`;

const visualizeItem = () => {
	const { token } = useLocalSearchParams<{ token: string }>();
	const { session, isLoading, signIn, signInWithGoogleReq } = useSession();
	const router = useRouter();
	const itemDelete = async () => {
		const req = await fetch(`${URL_API_ITEMS}/delete/${token}`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${session}`,
			}
		});
		const res = req.json();
		console.log(res);
		return router.replace('/')
	};
	return (
		<SafeAreaView
			style={{
				height: "100%",
				width: "100%",
				position: "relative",
				backgroundColor: 'blue'
			}}
		>
			<View
				style={{
					height: "100%",
					width: "100%",
					display: "flex",
					alignContent: "center",
					justifyContent: "center",
					backgroundColor:'white'
				}}
			>
				<TouchableOpacity
					style={{
						position: "absolute",
						top: 10,
						left: 10,
						padding: 15,
						backgroundColor: "#4b4b4b",
						borderRadius: 100,
						zIndex: 2,
					}}
					onPress={() => {
						router.back();
					}}
				>
					<Ionicons name="arrow-back-sharp" size={24} color="white" />
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						position: "absolute",
						top: 10,
						right: 10,
						padding: 15,
						backgroundColor: "#4b4b4b",
						borderRadius: 100,
						zIndex: 2,
					}}
					onPress={itemDelete}
				>
					<Feather name="trash-2" size={24} color="white" />
				</TouchableOpacity>
				<ReactNativeZoomableView
					maxZoom={5}
					minZoom={1}
					initialZoom={1}
					bindToBorders={true}
					style={{
					}}
				>
					<ImageToken
						style={{
							width: "100%",
							height: "100%",
						}}
						resizeMode="contain"
						token={token}
						type="ticket"
					/>
				</ReactNativeZoomableView>
			</View>
		</SafeAreaView>
	);
};

export default visualizeItem;
