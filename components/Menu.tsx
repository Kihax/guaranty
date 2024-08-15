import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useSession } from "@/auth/ctx";

/**
 * Constantes
 */
const URL_API_ITEMS = `${process.env.EXPO_PUBLIC_BASE_URL}/items`;

const Menu = (props: any) => {
	const { session, isLoading, signIn, signInWithGoogleReq } = useSession();
	if (!props?.show) {
		return <></>;
	}
	const itemDelete = async () => {
		const { token } = props;

		console.log(`${URL_API_ITEMS}/delete/${token}`);
		const req = await fetch(`${URL_API_ITEMS}/delete/${token}`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${session}`,
			}
		});
		const res = req.json();
		console.log(res);
		props?.setShow(false);
		await props?.loadArticles();
	};
	const editItem = () => {};
	return (
		<View
			style={{
				position: "absolute",
				top: props?.posY | 0,
				left: props?.posX | 0,
				width: 200,
				backgroundColor: "rgba(0, 0, 0, 0.5)",
				borderRadius: 5,
				zIndex: 25,
				overflow: "hidden",
			}}
		>
			<TouchableOpacity
				style={{
					paddingVertical: 10,
					paddingHorizontal: 10,
				}}
				onPress={editItem}
			>
				<Text
					style={{
						color: "white",
					}}
				>
					Edit
				</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={{
					paddingVertical: 10,
					paddingHorizontal: 10,
					backgroundColor: "rgba(255, 0, 0, 0.2)",
				}}
				onPress={itemDelete}
			>
				<Text
					style={{
						color: "red",
						fontWeight: "600",
					}}
				>
					Delete
				</Text>
			</TouchableOpacity>
		</View>
	);
};

export default Menu;
