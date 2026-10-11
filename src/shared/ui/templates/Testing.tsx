import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ProductsScreen } from './ProductsScreen'
import { SkeletonLoader } from './SkeletonLoader'
import { ConnectionState, EmptyState, ErrorState ,} from './FeedbackStates'
import { AppText } from '../atoms/AppText'

const Testing = () => {
  return (
    <ScrollView>
        <SkeletonLoader/>
        <EmptyState title="No Appoinments found" description="Try searching for something else" actionLabel="Search" onAction={() => {}} />
        <ConnectionState onRetry={() => {}} />
        <ErrorState onRetry={() => {}} />
    </ScrollView>
  )
}

export default Testing

const styles = StyleSheet.create({})