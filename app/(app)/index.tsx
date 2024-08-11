import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSession } from '@/auth/ctx'
import * as Network from 'expo-network';

export default function Main() {
    const { session, isLoading, signOut } = useSession();
    return (
        <SafeAreaView>
            <TouchableOpacity onPress={signOut}><Text>Logout</Text></TouchableOpacity>
        </SafeAreaView>
    )
}