import { View, Text, StyleSheet, Button } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomTextInput from "@/components/CustomTextInput";
import CustomButton from "@/components/CustomButton";
import { useSession } from "../../auth/ctx";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import DateTimePicker from "@react-native-community/datetimepicker";

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
	const [errorTicketPicture, setErrorTicketPicture] = useState<string>("");
	const [errorObjectName, setErrorObjectName] = useState<string>("");
	let tomorrow = new Date();
	tomorrow.setDate(tomorrow.getDate() + 1);

	const [date, setDate] = useState(tomorrow);
	const [mode, setMode] = useState("date");
	const [show, setShow] = useState(false);

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
		formData.append("objectName", objectName);

		formData.append("ticketPicture", imageToFormData(ticketPicture));
		if (objectPicture) {
			formData.append("objectPicture", imageToFormData(objectPicture));
		}
		formData.append("expiresAt", date.toLocaleDateString("fr-FR"));
		try {
			const response = await fetch(`${URL_API_ITEMS}/send`, {
				method: "POST",
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${session}`,
				},
				body: formData,
			});
			const res = await response.json();
			console.log(res);
			if (!res.error) {
				router.replace("/");
			}
		} catch (e) {
			console.error(e);
		}
	};

	const onChange = (event, selectedDate) => {
		const currentDate = selectedDate;
		setShow(false);
		setDate(currentDate);
	};

	const showMode = (currentMode) => {
		setShow(true);
		setMode(currentMode);
	};

	const showDatepicker = () => {
		showMode("date");
	};

	const submit = async () => {
		if (!ticketPicture) {
			setErrorTicketPicture("Ticket picture is required");
		} else {
			setErrorTicketPicture("");
		}

		if (objectName.length < 3 || objectName.length > 64) {
			setErrorObjectName("Object name should be between 3 and 64 chars");
		} else {
			setErrorObjectName("");
		}

		if (
			ticketPicture &&
			!(objectName.length < 3 || objectName.length > 64)
		) {
			await send();
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
					styleButton={{
						backgroundColor: "#f4f4f4",
					}}
					styleText={{
						color: "black",
					}}
					onPress={() => {
						pickImage(setTicketPicture);
					}}
				>
					Ticket picture
				</CustomButton>
				<Text style={styles.errorText}>{errorTicketPicture}</Text>

				<CustomTextInput
					label="Name of the objet"
					onChangeText={(text: string) => {
						setObjectName(text);
					}}
					value={objectName}
				/>
				<Text style={styles.errorText}>{errorObjectName}</Text>

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
					styleButton={{
						backgroundColor: "#f4f4f4",
					}}
					styleText={{
						color: "black",
					}}
					onPress={() => {
						pickImage(setObjectPicture);
					}}
				>
					Object picture
				</CustomButton>
				<CustomButton
					styleButton={{
						backgroundColor: "#f4f4f4",
					}}
					styleText={{
						color: "black",
					}}
					onPress={showDatepicker}
				>
					Expires At : {date.toLocaleDateString("fr-FR")}
				</CustomButton>
				{show && (
					<DateTimePicker
						testID="dateTimePicker"
						value={tomorrow}
						mode={mode}
						onChange={onChange}
						minimumDate={tomorrow}
					/>
				)}
				<CustomButton onPress={submit}>Submit</CustomButton>
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
	errorText: {
		color: "red",
	},
});

export default addItem;
