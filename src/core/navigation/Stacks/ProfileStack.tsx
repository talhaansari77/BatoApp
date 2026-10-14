import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ReportDetailsScreen } from "@/modules/medical-records/screens/ReportDetailsScreen";
import { ReportsScreen } from "@/modules/medical-records/screens/ReportsScreen";
import Playground from "@/shared/ui/templates/PlayGround/Playground";
import { Pressable, View, StyleSheet } from "react-native";
import {
  ArrowLeft,
  Bell,
  Cog,
  Plus,
  Search,
  ShoppingBag,
} from "lucide-react-native";
import { AppIcon } from "@/shared/ui/atoms/AppIcon";
import { BlurView } from "expo-blur";

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
        // options={{
        //   title: "Medical Reports",
        // }}
      />
      <Stack.Screen name="ReportDetails" component={ReportDetailsScreen} />
    </Stack.Navigator>
  );
}
