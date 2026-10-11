import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Playground from "@/shared/ui/templates/Playground";
import { Pressable } from "react-native";
import {
  ArrowLeft,
  ShoppingBag,
} from "lucide-react-native";
import { ProductsScreen } from "@/shared/ui/templates/ProductsScreen";
import Testing from "@/shared/ui/templates/Testing";

const Stack = createNativeStackNavigator<any>();


export function PlayGroundStack() {
  return (
    <Stack.Navigator>
        <Stack.Screen name="Testing" component={Testing} />
      <Stack.Screen
        name="Health & Beauty"
        component={Playground}
        options={({ navigation }) => ({
          headerLargeTitle: true,

          headerStyle: {
            backgroundColor: "transparent",
            padding: 0,
            margin: 0,
          },
          headerLeft: () => (
            <Pressable onPress={() => navigation.goBack()}>
              <ArrowLeft size={24} color="#000" />
            </Pressable>
          ),
          headerRight: () => (
            <Pressable onPress={() => navigation.goBack()}>
              <ShoppingBag size={24} color="#000" />
            </Pressable>
          ),

          headerSearchBarOptions: {
            placeholder: "Search reports...",
            autoCapitalize: "none",
            hideWhenScrolling: false,
            hideNavigationBar: false,
            obscureBackground: false,
            onChangeText: (event) => {
              navigation.setParams({
                searchQuery: event.nativeEvent.text,
              });
            },
            onCancelButtonPress: () => {
              navigation.setParams({ searchQuery: "" });
            },
          },
        })}
      />

      
    </Stack.Navigator>
  );
}
