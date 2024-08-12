import { View, Text, StyleSheet, Button } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomTextInput from "@/components/CustomTextInput";
import CustomButton from "@/components/CustomButton";
import { useSession } from "../../auth/ctx";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Image } from "expo-image";

/**
 * Constantes
 */
const URL_API_ITEMS = `${process.env.EXPO_PUBLIC_BASE_URL}/items`;

const addItem = () => {
	const [objectName, setObjectName] = useState<string>("");
	const [ticketPicture, setTicketPicture] = useState(null); // picture of the ticket
	const [objectPicture, setObjectPicture] = useState(null); // picture of the object
	const { session, isLoading, signIn, signInWithGoogleReq } = useSession();
	const router = useRouter();

	const pickImage = async (setImage: any) => {
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		if (!result.canceled) {
			setImage(result.assets[0].uri);
		}
	};

	const imageToFormData = (uri: any) => {
		const fileName = uri.split("/").pop();
		const fileType = fileName.split(".").pop();
		return {
			uri,
			name: fileName,
			type: `image/${fileType}`,
		};
	};

	const send = async () => {
		let formData = new FormData();
		//formData.append("name", name);
		console.log(imageToFormData(ticketPicture));
		formData.append("ticketPicture", imageToFormData(ticketPicture));
		formData.append("objectPicture", imageToFormData(objectPicture));
		formData.append("guarantyDuration", "6");

		const response = await fetch(`${URL_API_ITEMS}/send`, {
			method: "POST",
			headers: {
				"Content-Type": "multipart/form-data",
				Authorization: `Bearer ${session}`,
			},
			body: formData,
		});
		const res = await response.json();
		if (!res.error) {
			router.replace("/");
		}
	};

	return (
		<SafeAreaView style={styles.screen}>
			<View style={styles.container}>
				<Text style={styles.title}>Add Item</Text>
                <View
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					{ticketPicture && (
						<Image
							source={{ uri: ticketPicture }}
							style={styles.image}
						/>
					)}
				</View>
				<CustomButton
					onPress={() => {
						pickImage(setTicketPicture);
					}}
				>
					Ticket picture
				</CustomButton>
				

				<CustomTextInput
					label="Name of the objet"
					onChangeText={(text: string) => {
						setObjectName(text);
					}}
					value={objectName}
				/>

                <View
					style={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}
				>
					{objectPicture && (
						<Image
							source={{ uri: objectPicture }}
							style={styles.image}
						/>
					)}
				</View>
				<CustomButton
					onPress={() => {
						pickImage(setObjectPicture);
					}}
				>
					Object picture
				</CustomButton>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	screen: {
		backgroundColor: "blue",
		height: "100%",
		width: "100%",
	},
	container: {
		backgroundColor: "white",
		height: "100%",
		width: "100%",
		paddingHorizontal: 20,
		paddingTop: 10,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
	},
	forgot: {
		textAlign: "right",
		marginVertical: 10,
		fontWeight: "600",
	},
	noaccount: {
		marginVertical: 10,
		fontWeight: "600",
	},
	image: {
		width: 200,
		height: 200,
	},
});

export default addItem;
