import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Splash from "./screens/Auth/SplashScreen";
import Login from "./screens/Auth/LoginScreen";
import SignUp from "./screens/Auth/SignupScreen";
import onBoarding from "./screens/OnBoarding/OnBoardingForms";
import Dashboard from "./screens/Main/Dashboard";
import CguScreen from "./screens/Auth/CGUScreen";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import userReducer from "./reducers/userSlice";
import onBoardingReducer from "./reducers/onBoardingSlice";
import { PaperProvider } from "react-native-paper";

const rootReducer = combineReducers({
  user: userReducer,
  onBoarding: onBoardingReducer,
});

const persistConfig = {
  key: "Moovit",
  storage: AsyncStorage,
  whitelist: ["user", "onBoarding"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);
const Stack = createNativeStackNavigator();

export default function App() {
  // Attention Android requiert le nom Exact des fonts - passage des fonts sur https://fontdrop.info/ pour avoir le nom reeal
  const [fontsLoaded] = useFonts({
    "CocomatPro-Regular": require("./assets/fonts/cocomat-pro-regular.ttf"), // Ajout des fonts (Modification du nom des polices pour compatibilité sur android)
    ManropeExtraLight: require("./assets/fonts/Manrope-ExtraLight.ttf"),
    ManropeLight: require("./assets/fonts/Manrope-Light.ttf"),
    ManropeRegular: require("./assets/fonts/Manrope-Regular.ttf"),
    ManropeMedium: require("./assets/fonts/Manrope-Medium.ttf"),
    ManropeSemiBold: require("./assets/fonts/Manrope-SemiBold.ttf"),
    ManropeBold: require("./assets/fonts/Manrope-Bold.ttf"),
    ManropeExtraBold: require("./assets/fonts/Manrope-ExtraBold.ttf"),
    MaterialCommunityIcons: require("@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf"), // Ajout des fonts (Modification du nom des polices pour compatibilité sur android)
  });

  //if (!fontsLoaded) return null;

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Welcome" component={Splash} />
              <Stack.Screen name="S'inscrire" component={SignUp} />
              <Stack.Screen name="Se connecter" component={Login} />
              <Stack.Screen name="onBoarding" component={onBoarding} />
              <Stack.Screen name="cgu" component={CguScreen} />
              <Stack.Screen name="Dashboard" component={Dashboard} />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
