import { View, Text, TextInput, StyleSheet } from "react-native";
import React from "react";


const CustomTextInput = (props: any) => {
	return (
		<View>
			<Text aria-label={props?.label} nativeID={props?.label} style={styles.label}>
				{props?.label || ""}
			</Text>
			<View style={{
				display: "flex",
				position: "relative"
			}}>
				<TextInput aria-label="input"  aria-labelledby={props?.label} style={styles.input} placeholder={props?.label} {...props} />
				<View style={{
					position: "absolute",
					display:"flex",
					right: 7,
					height: "100%",
					justifyContent: "center",
					zIndex: 1
				}}>{props?.leftComponent}</View>
			</View>
			{props?.error ? <Text style={styles.errorText}>{props?.error}</Text> : <></>}
		</View>
	);
};

const styles = StyleSheet.create({
	label: {
		marginVertical: 10,
		fontWeight: "500",
		fontSize: 14
	},
	input: {
		borderRadius: 10,
		backgroundColor: "#f4f4f4",
		padding: 10,
		paddingRight: 40
	},
	errorText: {
		color: "red",
		fontSize: 12,
		marginTop: 5
	}
})

export default CustomTextInput;
