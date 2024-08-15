import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "@/auth/ctx";
import * as Network from "expo-network";
import { getArticles, updates } from "@/auth/storageArticles";
import { Link, Redirect, router } from "expo-router";
import Card from "@/components/Card";
import CustomButton from "@/components/CustomButton";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Menu from "@/components/Menu";

export default function Main() {
	const { session, isLoading, signOut } = useSession();
	if (!session) {
		return <Redirect href="(auth)/sign-in" />;
	}
	const [cards, setCards]: any[] = useState([]);
    const [posX, setPosX] = useState<Number>(0)
    const [posY, setPosY] = useState<Number>(0)
    const [show, setShow] = useState<Number>(0)
    const [token, setToken] = useState<string>("")
	const [isInternet, setIsInternet] = useState(false);
	const loadArticles = async () => {
		if (isLoading) return;
		setCards([]);
		const netState = await Network.getNetworkStateAsync();
		if (netState.isInternetReachable) {
			setIsInternet(true);
			const items = await updates(session);
			setCards(items);
		} else {
			setIsInternet(false);
			const items = await getArticles(session);
		}
	};

	useEffect(() => {
		loadArticles();
	}, [isLoading]);

	return (
		<SafeAreaView style={styles.screen}>
			<View style={styles.container}>
				{isInternet ? <Text></Text> : <Text>There is no internet</Text>}
                <CustomButton onPress={signOut}>Logout</CustomButton>
				<View>
					{cards.map((props, key) => {
						return <Card key={key} {...props} setPosX={setPosX} setPosY={setPosY} menuShow={show} menuToken={token} setShow={setShow} setToken={setToken} />;
					})}					
				</View>
				<TouchableOpacity
					style={{
						position: "absolute",
						bottom: 10,
						right: 10,
                        padding: 15,
                        backgroundColor: "#4b4b4b",
                        borderRadius: 100
					}}
                    onPress={() => {
                        router.navigate('(app)/add-item')
                    }}
				>
					<FontAwesome6 name="add" size={24} color="white" />
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

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
		position: "relative",
	},
});
