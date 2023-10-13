import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import { useDispatch } from "react-redux";

import { useAppSelector } from "./hooks";
import {
  addPullRequests,
  getPullsChartData,
  oneYearAgo,
} from "./services/github";

const width = Dimensions.get("window").width - 20;
const height = 220;

export const Chart = () => {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const data = useAppSelector((state) => getPullsChartData(state));

  useEffect(() => {
    async function fetchData(page: number = 1) {
      try {
        const response = await fetch(
          "https://api.github.com/repos/apple/swift/pulls?state=closed&per_page=100&page=" +
            page,
        );
        let json = await response.json();
        json = json.filter((pull: any) => !!pull.merged_at);

        const merged_at = new Date(json[json.length - 1].merged_at);

        if (merged_at < oneYearAgo) {
          setLoading(false);
        }

        dispatch(addPullRequests(json));
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }

    if (isLoading) {
      fetchData(page).then(() => {
        setPage(page + 1);
      });
    }
  }, [isLoading, page]);

  return (
    <View>
      {isLoading ? (
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Loading page {page}</Text>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : null}
      {data.labels.length > 0 && (
        <BarChart
          data={data}
          style={styles.graphStyle}
          width={width}
          height={height}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: "#000000",
            backgroundGradientFrom: "#1E2923",
            backgroundGradientTo: "#08130D",
            color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  graphStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
  loading: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginRight: 10,
  },
});
