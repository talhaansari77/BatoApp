// screens/ProductsScreen.tsx
import { FlatList, Text, View } from 'react-native';
import {
  StateView,
  type ViewState,
} from '../Placeholders/StateView';

type Product = {
  id: string;
  name: string;
};

type ProductsScreenProps = {
  products: Product[];
  isLoading: boolean;
  isOffline: boolean;
  error: Error | null;
  onRetry: () => void;
};

export function ProductsScreen({
  products = [],
  isLoading = false,
  isOffline = false,
  error = null,
  onRetry = () => {},
}: ProductsScreenProps) {
  const state: ViewState = isOffline
    ? { status: 'offline', onRetry }
    : isLoading
      ? { status: 'loading' }
      : error
        ? { status: 'error', message: error.message, onRetry }
        : products.length === 0
          ? {
              status: 'empty',
              title: 'No products found',
              description: 'Try adjusting your filters.',
            }
          : { status: 'success' };

  return (
    <View style={{ flex: 1 }}>
      <StateView state={state}>
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Text style={{ padding: 16 }}>{item.name}</Text>
          )}
        />
      </StateView>
    </View>
  );
}