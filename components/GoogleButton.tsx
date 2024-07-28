import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import GoogleIcon from "./GoogleIcon";

const GoogleButton = (props: any) => {
	return (
		<View>
			<TouchableOpacity
				{...props}
				style={{
					borderWidth: 1,
					padding: 15,
					borderRadius: 10,
					borderColor: "#e5e7eb",
					display: 'flex',
					flexDirection: "row",
					alignItems: "center",
					...props.style
				}}
			>
                <GoogleIcon style={{
					width: 25,
					height: 25
				}} />
				<View style={{width: 10}} />
				<Text
					style={{
						color: "rgb(17, 24, 39)",
						fontWeight: 600,
						marginRight: 20
					}}
				>
					{props?.title || "Continue with Google"}
				</Text>
			</TouchableOpacity>
		</View>
	);
};

export default GoogleButton;
