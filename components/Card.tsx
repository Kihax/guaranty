import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import ImageToken from "./ImageToken";
import DropDownIconButton from "./DropDownIconButton";
import { useRouter } from "expo-router";

const Card = (props) => {
	const date = new Date(props?.expiresAt);
	const router = useRouter();
	return (
		<TouchableOpacity
			style={styles.container}
			onPress={() => {
				router.navigate({
                    pathname: '(app)/visualize-item', 
                    params: {
                        token: props?.token
                    }
                });
			}}
		>
			<View
				style={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
				}}
			>
				<View
					style={{
						width: 45,
						height: 45,
					}}
				>
					<ImageToken
						style={{
							height: "100%",
							borderRadius: 7,
						}}
						token={props?.token}
						type="object"
					/>
				</View>
				<View
					style={{
						marginLeft: 10,
						display: "flex",
						alignItems: "center",
					}}
				>
					<Text style={styles.title}>{props?.objectName}</Text>
					<Text>{date.toLocaleDateString("fr-FR")}</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#f4f4f4",
		marginVertical: 10,
		padding: 10,
		borderRadius: 10,
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	title: {
		fontWeight: "500",
	},
});

export default Card;
