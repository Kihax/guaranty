import {
	View,
	Text,
	Pressable,
	StyleSheet,
	TouchableOpacity,
} from "react-native";
import React from "react";

const CustomButton = (props: any) => {
	return (
		<View>
			<TouchableOpacity style={[styles.button, props?.styleButton]} {...props}>
				<Text style={[styles.text, props?.styleText]}>{props?.children}</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	button: {
		backgroundColor: "#4b4b4b",
		marginVertical: 10,
		padding: 15,
		borderRadius: 10,
	},
	text: {
		textAlign: "center",
		color: "white",
		fontWeight: "bold",
		fontSize: 14,
	},
});

export default CustomButton;
