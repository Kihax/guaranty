import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const Menu = (props: any) => {
    if(!props?.show) {
        return (<></>)
    }
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
				onPress={() => console.log("hello world")}
			>
				<Text style={{
					color: "white"
				}}>Edit</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={{
					paddingVertical: 10,
					paddingHorizontal: 10,
					backgroundColor: "rgba(255, 0, 0, 0.2)",
				}}
				onPress={() => console.log("delete")}
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
