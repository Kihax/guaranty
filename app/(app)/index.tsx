import { View, Text, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSession } from "@/auth/ctx";
import * as Network from "expo-network";
import { getArticles, updates } from "@/auth/storageArticles";
import { Link, Redirect } from "expo-router";

export default function Main() {
	const { session, isLoading, signOut } = useSession();
    if(!session) {
        return <Redirect href="(auth)/sign-in" />;
    }
	const [cards, setCards]: any[] = useState([]);
	const [isInternet, setIsInternet] = useState(false);
	const loadArticles = async () => {
		if (isLoading) return;
		setCards([]);
		const netState = await Network.getNetworkStateAsync();
		if (netState.isInternetReachable) {
			setIsInternet(true);
			const articles = await updates(session);
			setCards(articles);
		} else {
			setIsInternet(false);
			const articles = await getArticles(session);
			setCards(articles);
		}
	};

	useEffect(() => {
		loadArticles();
	}, [isLoading]);

	return (
		<SafeAreaView>
            {isInternet ? <Text></Text> : <Text>There is no internet</Text>}
			<TouchableOpacity onPress={signOut}>
				<Text>Logout</Text>
                <Link href="(app)/add-item"><Text>Add item</Text></Link>
			</TouchableOpacity>
		</SafeAreaView>
	);
}
