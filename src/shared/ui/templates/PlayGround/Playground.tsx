import React from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { medicalBeautyProducts } from "../Mock/MockData";
import type { MedicalBeautyProduct } from "../Mock/MockData";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHeaderHeight } from "@react-navigation/elements";

const Playground = () => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const cardWidth = (width - 48) / 2;

  const renderProduct = ({ item }: { item: MedicalBeautyProduct }) => (
    <View style={[styles.card, { width: cardWidth }]}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.details}>
        <Text style={styles.category}>{item.category}</Text>

        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        <Text style={styles.price}>{item.price.toFixed(3)} KD</Text>
      </View>
    </View>
  );

  const headerheight = useHeaderHeight();
  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="on-drag"
      data={medicalBeautyProducts}
      renderItem={renderProduct}
      ListHeaderComponentStyle={{}}
      //   ListHeaderComponent={() => (
      //     <View>
      //       <Text style={styles.heading}>Health & Beauty</Text>

      //       <Text style={styles.subtitle}>
      //         Discover products selected for your skincare routine.
      //       </Text>
      //     </View>
      //   )}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
};

{
  /* <FlatList
      style={{ paddingTop: insets.top}}
      data={medicalBeautyProducts}
      renderItem={renderProduct}
      ListHeaderComponentStyle={{ }}
      ListHeaderComponent={() => (
        <View>
          <Text style={styles.heading}>Health & Beauty</Text>

          <Text style={styles.subtitle}>
            Discover products selected for your skincare routine.
          </Text>
        </View>
      )}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    /> */
}
export default Playground;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF9F6",
    paddingTop: 20,
  },
  heading: {
    fontSize: 25,
    fontWeight: "700",
    color: "#292721",
    paddingHorizontal: 16,
  },
  subtitle: {
    fontSize: 13,
    color: "#827D73",
    marginTop: 6,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#EEEAE3",
  },
  image: {
    width: "100%",
    height: 145,
    backgroundColor: "#F0EDE7",
  },
  details: {
    padding: 12,
  },
  category: {
    fontSize: 10,
    color: "#A18456",
    textTransform: "uppercase",
    letterSpacing: 0.7,
    marginBottom: 6,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: "#292721",
    minHeight: 36,
  },
  description: {
    fontSize: 11,
    color: "#827D73",
    lineHeight: 16,
    marginTop: 5,
    minHeight: 32,
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    color: "#A18456",
    marginTop: 12,
  },
});
