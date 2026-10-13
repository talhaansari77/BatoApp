import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  Image,
  Platform,
} from "react-native";
import { SearchWithFilters } from "./SearchWithFilters";
import { FilterConfig, FilterValues } from "./types";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Data ─────────────────────────────────────────────────────────────────────

type Product = {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  inStock: boolean;
  releaseDate: string;
};

const ALL_PRODUCTS: Product[] = [
  { id: "1", name: "Wireless Headphones Pro", category: "Electronics", brand: "Sony", price: 299, inStock: true, releaseDate: "2024-03-01" },
  { id: "2", name: "Running Shoes X1", category: "Footwear", brand: "Nike", price: 120, inStock: true, releaseDate: "2024-01-15" },
  { id: "3", name: "Leather Wallet", category: "Accessories", brand: "Bellroy", price: 75, inStock: false, releaseDate: "2023-11-20" },
  { id: "4", name: "Smart Watch Ultra", category: "Electronics", brand: "Apple", price: 799, inStock: true, releaseDate: "2024-06-10" },
  { id: "5", name: "Cotton T-Shirt", category: "Clothing", brand: "Uniqlo", price: 25, inStock: true, releaseDate: "2024-02-05" },
  { id: "6", name: "Noise-Cancelling Buds", category: "Electronics", brand: "Sony", price: 199, inStock: false, releaseDate: "2024-04-18" },
  { id: "7", name: "Trail Running Shoes", category: "Footwear", brand: "Salomon", price: 160, inStock: true, releaseDate: "2024-05-01" },
  { id: "8", name: "Minimalist Backpack", category: "Accessories", brand: "Bellroy", price: 189, inStock: true, releaseDate: "2023-12-01" },
  { id: "9", name: "Slim Fit Jeans", category: "Clothing", brand: "Levi's", price: 89, inStock: true, releaseDate: "2024-01-10" },
  { id: "10", name: "Mechanical Keyboard", category: "Electronics", brand: "Keychron", price: 139, inStock: false, releaseDate: "2024-03-22" },
];

// ─── Filter configuration ─────────────────────────────────────────────────────

const PRODUCT_FILTERS: FilterConfig[] = [
  {
    type: "singleSelect",
    key: "category",
    label: "Category",
    options: [
      { label: "Electronics", value: "Electronics" },
      { label: "Footwear", value: "Footwear" },
      { label: "Accessories", value: "Accessories" },
      { label: "Clothing", value: "Clothing" },
    ],
  },
  {
    type: "multiSelect",
    key: "brands",
    label: "Brand",
    options: [
      { label: "Sony", value: "Sony" },
      { label: "Nike", value: "Nike" },
      { label: "Apple", value: "Apple" },
      { label: "Bellroy", value: "Bellroy" },
      { label: "Uniqlo", value: "Uniqlo" },
      { label: "Salomon", value: "Salomon" },
      { label: "Levi's", value: "Levi's" },
      { label: "Keychron", value: "Keychron" },
    ],
    defaultValue: [],
  },
  {
    type: "boolean",
    key: "inStock",
    label: "In Stock Only",
    defaultValue: false,
  },
  {
    type: "numberRange",
    key: "price",
    label: "Price (USD)",
    min: 0,
    max: 1000,
    defaultValue: { min: undefined, max: undefined },
  },
  {
    type: "date",
    key: "releasedAfter",
    label: "Released After",
  },
];

// ─── Filtering logic (lives in the screen, not the component) ─────────────────

function applyFilters(
  products: Product[],
  query: string,
  filters: FilterValues
): Product[] {
  return products.filter((p) => {
    // Search query
    if (query.trim() && !p.name.toLowerCase().includes(query.toLowerCase())) {
      return false;
    }

    // Category (singleSelect)
    if (filters.category && p.category !== filters.category) return false;

    // Brand (multiSelect)
    const brands = filters.brands as string[] | undefined;
    if (brands && brands.length > 0 && !brands.includes(p.brand)) return false;

    // In stock (boolean)
    if (filters.inStock === true && !p.inStock) return false;

    // Price range (numberRange)
    const price = filters.price as { min?: number; max?: number } | undefined;
    if (price?.min !== undefined && p.price < price.min) return false;
    if (price?.max !== undefined && p.price > price.max) return false;

    // Released after (date)
    if (filters.releasedAfter && p.releaseDate < (filters.releasedAfter as string))
      return false;

    return true;
  });
}

// ─── Product Card ─────────────────────────────────────────────────────────────

const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
  <View style={cardStyles.card}>
    <View style={cardStyles.info}>
      <Text style={cardStyles.name}>{product.name}</Text>
      <Text style={cardStyles.meta}>
        {product.brand} · {product.category}
      </Text>
      <View style={cardStyles.footer}>
        <Text style={cardStyles.price}>${product.price}</Text>
        <View
          style={[
            cardStyles.badge,
            product.inStock ? cardStyles.inStock : cardStyles.outOfStock,
          ]}
        >
          <Text style={cardStyles.badgeText}>
            {product.inStock ? "In Stock" : "Out of Stock"}
          </Text>
        </View>
      </View>
    </View>
  </View>
);

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  info: { gap: 4 },
  name: { fontSize: 16, fontWeight: "600", color: "#000" },
  meta: { fontSize: 13, color: "#8E8E93" },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  price: { fontSize: 17, fontWeight: "700", color: "#007AFF" },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  inStock: { backgroundColor: "#E6F9EF" },
  outOfStock: { backgroundColor: "#FFF0F0" },
  badgeText: { fontSize: 12, fontWeight: "600" },
});

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ProductListScreen() {
  const [query, setQuery] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<FilterValues>({});

  const results = useMemo(
    () => applyFilters(ALL_PRODUCTS, query, appliedFilters),
    [query, appliedFilters]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        {/* <Text style={styles.title}>Products</Text> */}
        <Text style={styles.count}>
          {results.length} of {ALL_PRODUCTS.length}
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <SearchWithFilters
          placeholder="Search products…"
          filters={PRODUCT_FILTERS}
          initialFilters={{}}
          onQueryChange={setQuery}
          onSearch={(q, f) => {
            setQuery(q);
            setAppliedFilters(f);
          }}
          onFiltersApply={setAppliedFilters}
          onFiltersReset={() => setAppliedFilters({})}
        />
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard product={item} />}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No products found.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? 16 : 8,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#000",
  },
  count: {
    fontSize: 14,
    color: "#8E8E93",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  empty: {
    alignItems: "center",
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#8E8E93",
  },
});