import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AppInput } from '../../atoms/AppInput'

const Search = () => {
  return (
    <View>
      <Text>Search</Text>
      <AppInput
      leftIcon='Search'
      />
    </View>
  )
}

export default Search

const styles = StyleSheet.create({})