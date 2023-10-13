import { StyleSheet, View } from "react-native";
import { Provider } from "react-redux";

import { Chart } from "./src/Chart";
import { store } from "./src/store";

const App = () => {
  return (
    <Provider store={store}>
      <View style={styles.container}>
        <Chart />
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
