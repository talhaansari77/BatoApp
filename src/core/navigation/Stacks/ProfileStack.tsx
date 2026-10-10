
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
           options={({ navigation }) => ({
          headerShown: true,
          title: "Medical Reports",

          headerSearchBarOptions: {
            placeholder: "Search reports...",
          },

          headerLeft: () => (
            <Pressable onPress={() => navigation.goBack()}>
              <ArrowLeft size={24} color="#000" />
            </Pressable>
          ),
        })}
        component={ReportsScreen}
      />
      <Stack.Screen
        name="ReportDetails" 
        component={ReportDetailsScreen}
      />
    </Stack.Navigator>
  );
}