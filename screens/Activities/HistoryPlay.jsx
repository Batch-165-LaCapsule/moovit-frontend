import React, { useState, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, ScrollView, Dimensions } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import OnPlay from "./OnActPlay/OnPlay";
import OnDone from "./OnActPlay/OnDone";
import OnProgress from "./OnActPlay/OnProgress";

import { addUserToStore } from "../../reducers/userSlice";
import Button from "../../components/Buttons";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
// import { ScrollView } from "react-native-web";
import { Platform } from "react-native";
const { width, height } = Dimensions.get('window');


export default function HistoryPlay({ navigation, route }) {
  const { leveling } = route.params;
  console.log("ppp ", leveling);

  const user = useSelector((state) => state.user.value);
  const activity = useSelector((state) => state.activity.value);
  const dispatch = useDispatch();
  const tabLevel = ["onPlay", "onDone", "onProgress"];
  const [levelStatus, setLevelStatus] = useState(0);

  const plusstate = () => {
    if (levelStatus < tabLevel.length - 1) {
      setLevelStatus(levelStatus + 1);
    } else {
      navigation.navigate("TabNavigator");
      setLevelStatus(0);
    }
  };
  const moinstate = () => {
    if (levelStatus > 0) {
      setLevelStatus(levelStatus - 1);
    } else {
      navigation.goBack();
    }
  };

  const totalSubLevels = activity.length;
  let currentLevel = [user.currentLevelID, user.currentSubLevelID];
  let nextLevel = [];

  if (currentLevel[1] == totalSubLevels) {
    nextLevel = [currentLevel[0] + 1, 1];
    currentLevel[1] = 0;
    currentLevel[0] = currentLevel[0] + 1;
  } else {
    nextLevel = [currentLevel[0], currentLevel[1] + 1];
  }

  const [level, setLevel] = useState(currentLevel[0]);
  const [subLevel, setSubLevel] = useState(currentLevel[1]);
  const subLevelInfos = activity[leveling - 1];

  const timing = subLevelInfos.timing;
  const levelxp = subLevelInfos.xp;
  const titleSubLevel = subLevelInfos.title;
  const pourcent = Math.floor((100 * (subLevel + 1)) / totalSubLevels);

  useEffect(() => {
    setLevel(currentLevel[0]);
    setSubLevel(currentLevel[1]);
  }, [user.currentLevelID, user.currentSubLevelID]);

  let toDisp;
  if (tabLevel[levelStatus] === "onPlay") {
    toDisp = <OnPlay infos={subLevelInfos} title={subLevelInfos.title} />;
  } else if (tabLevel[levelStatus] === "onDone") {
    toDisp = (
      <OnDone
        user={user.username}
        timing={timing}
        xp={levelxp}
        onPress={moinstate}
        sport={user.sportPlayed}
      />
    );
  } else if (tabLevel[levelStatus] === "onProgress") {
    toDisp = (
      <OnProgress
        total={totalSubLevels}
        level={level}
        xp={levelxp}
        name={titleSubLevel}
        pourcent={pourcent}
        onPress={moinstate}
        token={user.token}
        sport={user.sportPlayed}
        xpUpdated={levelxp + user.xp}
        updatelvl={nextLevel}
        renit={() => setLevelStatus(0)}
        levelmoins={level}
        levelplus={level + 1}
        sessions={user.sessions}
        playTime={user.playTime}
        timing={timing}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* <ScrollView> */}
        <View style={styles.back}>
          <TouchableOpacity style={styles.backButton} onPress={moinstate}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.container}>{toDisp}</View>
        <View style={styles.header}>
          <Button
            title="Continuer"
            onPress={plusstate}
            type="primary"
            style={styles.continueBtn}
            backgroundColor={"#d6c9ff"}
            width={"100%"}
          />
        </View>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
   
   
  },
  header: {
    flexDirection: "row",
    marginHorizontal: "auto",
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    ...(Platform.OS==="android" && { marginBottom:height*0.05,}),
     ...(Platform.OS==="ios" && { marginBottom:height*-0.015,}),
  
  },
  back: {
    width: "20%",
    ...(Platform.OS==="android" && {marginTop:height*0.025}),
    
    
  },

  container: {
    flex: 1,
  },
  backButton: {
    paddingLeft: 30,
   
  },
});
