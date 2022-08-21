import React, { useState } from "react";
import {
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import styles from "./styles";

export default function Home({ navigation }) {
  const [text, setText] = useState("");
  const conditionText = "Ready!";

  return (
    <SafeAreaView style={styles.container}>
      {text == conditionText ? (
        <TouchableOpacity onPress={() => navigation.navigate("PokeDex")}>
          <Image
            style={styles.img}
            source={require("../../assets/pokemon-logo.png")}
          />
        </TouchableOpacity>
      ) : null}

      <Text style={[styles.textMaster, { fontWeight: "bold" }]}>
        Requirement: Try to show the hidden image and make it clickable that
        goes to /pokedex when the input below is "Ready!" remember to hide the
        red text away when "Ready!" is in the textbox.
      </Text>

      <Text style={styles.textMaster}>
        Are you ready to be a pokemon master?
      </Text>

      <TextInput style={styles.input} onChangeText={setText} value={text} />

      {text != conditionText ? (
        <Text style={[styles.textMaster, { color: "red" }]}>
          I am not ready yet!
        </Text>
      ) : null}
    </SafeAreaView>
  );
}
