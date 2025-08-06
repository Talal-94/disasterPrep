import { View, Text } from "react-native";
import {
  Feather,
  Ionicons,
  //   FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

interface MetricProps {
  humidity: number;
  wind: number;
  visibility: number;
  pressure: number;
}

export default function WeatherMetricsGrid({
  humidity,
  wind,
  visibility,
  pressure,
}: MetricProps) {
  return (
    <View
      style={{
        backgroundColor: "#f1f1f1",
        margin: 16,
        borderRadius: 12,
        padding: 20,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <View style={{ alignItems: "center", width: "50%", marginBottom: 20 }}>
          <Feather name="droplet" size={24} color="#333" />
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>{humidity}%</Text>
          <Text style={{ color: "#555" }}>Humidity</Text>
        </View>

        <View style={{ alignItems: "center", width: "50%", marginBottom: 20 }}>
          <Feather name="wind" size={24} color="#333" />
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>{wind} mph</Text>
          <Text style={{ color: "#555" }}>Wind Speed</Text>
        </View>

        <View style={{ alignItems: "center", width: "50%", marginBottom: 20 }}>
          <Ionicons name="eye-outline" size={24} color="#333" />
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            {visibility} mi
          </Text>
          <Text style={{ color: "#555" }}>Visibility</Text>
        </View>

        <View style={{ alignItems: "center", width: "50%", marginBottom: 20 }}>
          <MaterialCommunityIcons name="speedometer" size={24} color="#333" />
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>
            {pressure} in
          </Text>
          <Text style={{ color: "#555" }}>Pressure</Text>
        </View>
      </View>
    </View>
  );
}
