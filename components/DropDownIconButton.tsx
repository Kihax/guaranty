import { View, Text, TouchableOpacity } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { useState } from "react";

const DropDownIconButton = (props) => {
	return (
		<View style={{}}>
			<TouchableOpacity
				style={{
					padding: 10,
				}}
				onPress={(event) => {
					const layout = event.nativeEvent;

					event.currentTarget.measure((x, y, w, h, pgX, pgY) => {
						if (props?.token != props?.menuToken) {
							props?.setShow(true);
							props?.setToken(props?.token);
						} else {
							props?.setShow(!props?.menuShow);
						}
						props?.setPosX(pgX - 160);
						props?.setPosY(pgY - 70);
					});
				}}
			>
				<Entypo name="dots-three-vertical" size={18} color="black" />
			</TouchableOpacity>
		</View>
	);
};

export default DropDownIconButton;
