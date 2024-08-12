import React, { useEffect, useState } from "react";
import { Image } from "expo-image";
import * as FileSystem from "expo-file-system";
import { useStorageState } from "@/auth/useStorageState";
import { getNetworkStateAsync } from "expo-network";
import { useAssets } from "expo-asset";

/**
 * constantes
 */
const URL_API_ITEMS = `${process.env.EXPO_PUBLIC_BASE_URL}/items`;

// Checks if gif directory exists. If not, creates it
async function ensureDirExists(dir: string) {
	const dirInfo = await FileSystem.getInfoAsync(dir);
	if (!dirInfo.exists) {
		await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
	}
}

export default function ImageToken(props: any) {
	// importe l'image et la stock dans le cache
	const [[isLoading, session], setSession] = useStorageState("session");
	const [assets, error] = useAssets([
		require("../assets/images/unvailable.jpg"),
	]);
	const imageToken = props.token;
	const type = props.type;
	const imageDir = FileSystem.cacheDirectory + type + "/";
	const imageUri = imageDir + imageToken;
	const imageUrl =
		`${URL_API_ITEMS}/items` +
		type +
		"/" +
		imageToken;

	const [uri, setUri] = useState<any>("");

	let _props = props;
	delete _props.token;
	delete _props.type;

	useEffect(() => {
		const getUriOrDownload = async () => {
			if (isLoading) return;
			await ensureDirExists(imageDir);
			const fileInfo = await FileSystem.getInfoAsync(imageUri);
			let download = false;
			const internetAvailable = (await getNetworkStateAsync())
				.isInternetReachable;

			if (!fileInfo.exists) {
				download = true;
			} else if (internetAvailable) {
				const currentHash = (
					await FileSystem.getInfoAsync(imageUri, {
						md5: true,
					})
				).md5;
				const response = await fetch(
					`${URL_API_ITEMS}/picture/${type}/hash/${imageToken}`,
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${session}`,
						},
					}
				);
				const { hash } = await response.json();
				if (hash != currentHash) {
					download = true;
				}
			}

			if (download) {
				await FileSystem.downloadAsync(imageUrl, imageUri, {
					headers: {
						Authorization: `Bearer ${session}`,
					},
				});
			}

			setUri(imageUri);
		};

		if (assets) {
			setUri(assets[0]);
		}

		getUriOrDownload().catch(console.error);
	}, [isLoading]);

	return <Image source={uri} {..._props}></Image>;
}
