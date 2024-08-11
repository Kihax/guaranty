import { Text } from 'react-native';
import { Redirect, Stack, Slot } from 'expo-router';

import { useSession } from '../../auth/ctx';

export default function AppLayout() {
  const { session, isLoading } = useSession();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  console.log(session)

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    console.log("not sign in")
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="(auth)/sign-in" />;
  }

  console.log("render index")

  // This layout can be deferred because it's not the root layout.
  return <Slot />;
}