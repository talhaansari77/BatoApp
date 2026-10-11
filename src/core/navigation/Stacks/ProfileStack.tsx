import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Pressable } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { ReportDetailsScreen } from "@/modules/medical-records/screens/ReportDetailsScreen";
import { ReportsScreen } from "@/modules/medical-records/screens/ReportsScreen";

const Stack = createNativeStackNavigator<any>();
export function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
  name="MedicalReports"
  component={ReportsScreen}
  options={({ navigation }) => ({
    headerShown: true,
    title: "Medical Reports",

    headerTransparent: true,
    headerBlurEffect: "systemMaterial",
    headerShadowVisible: false,
    headerTintColor: "#000",

    headerLargeTitle: true,
    headerLargeTitleShadowVisible: false,
    headerLargeTitleStyle: {
      color: "#000",
    },

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
      <Stack.Screen name="ReportDetails" component={ReportDetailsScreen} />
    </Stack.Navigator>
  );
}
