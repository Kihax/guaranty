import * as FileSystem from "expo-file-system";
import * as Network from "expo-network";

async function ensureDirExists(dir: string) {
	const dirInfo = await FileSystem.getInfoAsync(dir);
	if (!dirInfo.exists) {
		await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
	}
}

const articlesDir = FileSystem.cacheDirectory + "articles/";
const articlesFile = articlesDir + "articles";

export async function updates(session: string | null) {
	// met à jour le fichier et renvoie les articles
	const netState = await Network.getNetworkStateAsync();
	if (netState.isInternetReachable) {
		const response = await fetch(
			`https://192.168.1.14:3333/api/articles/get`,
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
		return JSON.parse(articlesString);
	}
}
