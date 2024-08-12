import * as FileSystem from "expo-file-system";
import * as Network from "expo-network";

/**
 * 
 * constante
 */
const articlesDir = FileSystem.cacheDirectory + "items/";
const articlesFile = articlesDir + "items";
const URL_API_ITEMS = `${process.env.EXPO_PUBLIC_BASE_URL}/items`;

async function ensureDirExists(dir: string) {
	const dirInfo = await FileSystem.getInfoAsync(dir);
	if (!dirInfo.exists) {
		await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
	}
}

export async function updates(session: string | null) {
	// met à jour le fichier et renvoie les articles
	const netState = await Network.getNetworkStateAsync();
	if (netState.isInternetReachable) {
		const response = await fetch(
			`${URL_API_ITEMS}/get`,
			{
				method: "GET",
				headers: {
					Authorization: `Bearer ${session}`,
				},
			}
		);
		const res = await response.json();
		if (res?.length > 0) {
			await ensureDirExists(articlesDir);
			const fileInfo = await FileSystem.getInfoAsync(articlesFile);

			await FileSystem.writeAsStringAsync(
				articlesFile,
				JSON.stringify(res),
				{
					encoding: FileSystem.EncodingType.UTF8,
				}
			);

			return res;
		}
	}

	return [];
}

export async function getArticles(session: string | null) {
	await ensureDirExists(articlesDir);
	const fileInfo = await FileSystem.getInfoAsync(articlesFile);

	if (!fileInfo.exists) {
		const articles = await updates(session);
		return articles;
	} else {
		const articlesString = await FileSystem.readAsStringAsync(articlesFile);
		if(articlesString) {
			try {
				const str = JSON.parse(articlesString);
				if(str?.length > 0) {
					return str
				}
				return []
			} catch (e) {
				return []
			}
			
		}
		
	}
	return []
}
